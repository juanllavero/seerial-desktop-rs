use std::sync::{Arc, Mutex};
use libmpv2::Mpv;
use tauri::{Manager, State, Window, Emitter};
use raw_window_handle::{HasWindowHandle, HasDisplayHandle};

pub struct MpvState {
    mpv: Arc<Mutex<Mpv>>,
}

#[tokio::main]
async fn main() {
    let mpv = Arc::new(Mutex::new(
        Mpv::with_initializer(|init| {
            init.set_property("vo", "gpu")?;
            init.set_property("hwdec", "auto")?;
            init.set_property("keep-open", "always")?;
            init.set_property("idle", "once")?;
            init.set_property("msg-level", "all=debug")?;
            init.set_property("log-file", "./logs/mpv_log.txt")?;
            // Inicialmente sin ventana, la configuraremos después
            init.set_property("force-window", "no")?;
            init.set_property("wid", 0i64)?; // Lo configuraremos después
            Ok(())
        }).expect("Failed to initialize MPV")
    ));

    let mpv_state = MpvState {
        mpv: mpv.clone(),
    };

    tauri::Builder::default()
        .setup(move |app| {
            let window = app.get_webview_window("main").unwrap();
            
            // Configurar MPV para usar la ventana de Tauri
            if let Ok(window_handle) = window.window_handle() {
                let raw_handle = window_handle.as_raw();
                
                #[cfg(target_os = "windows")]
                {
                    use raw_window_handle::Win32WindowHandle;
                    if let raw_window_handle::RawWindowHandle::Win32(handle) = raw_handle {
                        let hwnd = handle.hwnd.get() as i64;
                        if let Ok(mpv_guard) = mpv.lock() {
                            let _ = mpv_guard.set_property("wid", hwnd);
                            let _ = mpv_guard.set_property("force-window", "yes");
                        }
                    }
                }
                
                #[cfg(target_os = "linux")]
                {
                    use raw_window_handle::XlibWindowHandle;
                    if let raw_window_handle::RawWindowHandle::Xlib(handle) = raw_handle {
                        let window_id = handle.window as i64;
                        if let Ok(mpv_guard) = mpv.lock() {
                            let _ = mpv_guard.set_property("wid", window_id);
                            let _ = mpv_guard.set_property("force-window", "yes");
                        }
                    }
                }
                
                #[cfg(target_os = "macos")]
                {
                    use raw_window_handle::AppKitWindowHandle;
                    if let raw_window_handle::RawWindowHandle::AppKit(handle) = raw_handle {
                        let ns_window = handle.ns_window.as_ptr() as i64;
                        if let Ok(mpv_guard) = mpv.lock() {
                            let _ = mpv_guard.set_property("wid", ns_window);
                            let _ = mpv_guard.set_property("force-window", "yes");
                        }
                    }
                }
            }
            
            println!("MPV initialized and embedded in Tauri window");
            Ok(())
        })
        .manage(mpv_state)
        .invoke_handler(tauri::generate_handler![
            play, 
            pause, 
            stop, 
            loadfile, 
            get_position, 
            set_position,
            get_duration,
            set_volume,
            get_volume,
            embed_mpv
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}

#[tauri::command]
fn embed_mpv(window: Window, state: State<MpvState>) -> Result<(), String> {
    if let Ok(window_handle) = window.window_handle() {
        let raw_handle = window_handle.as_raw();
        
        #[cfg(target_os = "windows")]
        {
            use raw_window_handle::Win32WindowHandle;
            if let raw_window_handle::RawWindowHandle::Win32(handle) = raw_handle {
                let hwnd = handle.hwnd.get() as i64;
                state.mpv
                    .lock()
                    .map_err(|e| format!("Failed to lock MPV: {}", e))?
                    .set_property("wid", hwnd)
                    .map_err(|e| format!("Failed to embed MPV: {}", e))?;
            }
        }
    }
    Ok(())
}

#[tauri::command]
fn play(state: State<MpvState>) -> Result<(), String> {
    state.mpv
        .lock()
        .map_err(|e| format!("Failed to lock MPV: {}", e))?
        .set_property("pause", false)
        .map_err(|e| format!("Failed to play: {}", e))
}

#[tauri::command]
fn pause(state: State<MpvState>) -> Result<(), String> {
    state.mpv
        .lock()
        .map_err(|e| format!("Failed to lock MPV: {}", e))?
        .set_property("pause", true)
        .map_err(|e| format!("Failed to pause: {}", e))
}

#[tauri::command]
fn stop(state: State<MpvState>) -> Result<(), String> {
    state.mpv
        .lock()
        .map_err(|e| format!("Failed to lock MPV: {}", e))?
        .command("stop", &[] as &[&str])
        .map_err(|e| format!("Failed to stop: {}", e))
}

#[tauri::command]
fn loadfile(state: State<MpvState>, file: String) -> Result<(), String> {
    println!("Loading file: {}", file);
    
    if !std::path::Path::new(&file).exists() {
        return Err(format!("File does not exist: {}", file));
    }

    state.mpv
        .lock()
        .map_err(|e| format!("Failed to lock MPV: {}", e))?
        .command("loadfile", &[&file, "replace"])
        .map_err(|e| format!("Failed to load file: {}", e))
}

#[tauri::command]
fn get_position(state: State<MpvState>) -> Result<f64, String> {
    state.mpv
        .lock()
        .map_err(|e| format!("Failed to lock MPV: {}", e))?
        .get_property("time-pos")
        .map_err(|e| format!("Failed to get position: {}", e))
}

#[tauri::command]
fn set_position(state: State<MpvState>, position: f64) -> Result<(), String> {
    state.mpv
        .lock()
        .map_err(|e| format!("Failed to lock MPV: {}", e))?
        .set_property("time-pos", position)
        .map_err(|e| format!("Failed to set position: {}", e))
}

#[tauri::command]
fn get_duration(state: State<MpvState>) -> Result<f64, String> {
    state.mpv
        .lock()
        .map_err(|e| format!("Failed to lock MPV: {}", e))?
        .get_property("duration")
        .map_err(|e| format!("Failed to get duration: {}", e))
}

#[tauri::command]
fn set_volume(state: State<MpvState>, volume: f64) -> Result<(), String> {
    state.mpv
        .lock()
        .map_err(|e| format!("Failed to lock MPV: {}", e))?
        .set_property("volume", volume)
        .map_err(|e| format!("Failed to set volume: {}", e))
}

#[tauri::command]
fn get_volume(state: State<MpvState>) -> Result<f64, String> {
    state.mpv
        .lock()
        .map_err(|e| format!("Failed to get volume: {}", e))?
        .get_property("volume")
        .map_err(|e| format!("Failed to get volume: {}", e))
}