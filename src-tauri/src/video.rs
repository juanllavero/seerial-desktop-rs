use std::sync::{Arc, Mutex};
use libmpv2::Mpv;
use tauri::{State, Window};
use raw_window_handle::{HasWindowHandle};

pub struct MpvState {
    pub mpv: Arc<Mutex<Mpv>>,
}

impl MpvState {
    pub fn new() -> Self {
        let mpv = Arc::new(Mutex::new(
            Mpv::with_initializer(|init| {
                init.set_property("vo", "gpu")?;
                init.set_property("hwdec", "auto")?;
                init.set_property("keep-open", "always")?;
                init.set_property("idle", "once")?;
                init.set_property("msg-level", "all=debug")?;
                init.set_property("log-file", "./logs/mpv_log.txt")?;
                init.set_property("force-window", "no")?;
                init.set_property("wid", 0i64)?;
                Ok(())
            }).expect("Failed to initialize MPV")
        ));

        MpvState { mpv }
    }
}

#[tauri::command]
pub fn embed_mpv(window: Window, state: State<MpvState>) -> Result<(), String> {
    if let Ok(window_handle) = window.window_handle() {
      let raw_handle = window_handle.as_raw();

      #[cfg(target_os = "windows")]
      {
         if let raw_window_handle::RawWindowHandle::Win32(handle) = raw_handle {
               let hwnd = handle.hwnd.get() as i64;
               state.mpv.lock().map_err(|e| e.to_string())?
                  .set_property("wid", hwnd)
                  .map_err(|e| e.to_string())?;
               state.mpv.lock().map_err(|e| e.to_string())?
                  .set_property("force-window", "yes")
                  .map_err(|e| e.to_string())?;
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

    Ok(())
}

#[tauri::command]
pub fn play(state: State<MpvState>) -> Result<(), String> {
    state.mpv.lock().map_err(|e| e.to_string())?
        .set_property("pause", false)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn pause(state: State<MpvState>) -> Result<(), String> {
    state.mpv.lock().map_err(|e| e.to_string())?
        .set_property("pause", true)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn stop(state: State<MpvState>) -> Result<(), String> {
    state.mpv.lock().map_err(|e| e.to_string())?
        .command("stop", &[])
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn loadfile(state: State<MpvState>, file: String) -> Result<(), String> {
    if !std::path::Path::new(&file).exists() {
        return Err(format!("File does not exist: {}", file));
    }

    state.mpv.lock().map_err(|e| e.to_string())?
        .command("loadfile", &[&file, "replace"])
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_position(state: State<MpvState>) -> Result<f64, String> {
    state.mpv.lock().map_err(|e| e.to_string())?
        .get_property("time-pos")
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn set_position(state: State<MpvState>, position: f64) -> Result<(), String> {
    state.mpv.lock().map_err(|e| e.to_string())?
        .set_property("time-pos", position)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_duration(state: State<MpvState>) -> Result<f64, String> {
    state.mpv.lock().map_err(|e| e.to_string())?
        .get_property("duration")
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn set_volume(state: State<MpvState>, volume: f64) -> Result<(), String> {
    state.mpv.lock().map_err(|e| e.to_string())?
        .set_property("volume", volume)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_volume(state: State<MpvState>) -> Result<f64, String> {
    state.mpv.lock().map_err(|e| e.to_string())?
        .get_property("volume")
        .map_err(|e| e.to_string())
}
