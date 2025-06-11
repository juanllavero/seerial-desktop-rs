mod video;

use tauri::Manager;
use video::{
    MpvState, embed_mpv, play, pause, stop, loadfile, get_position, set_position,
    get_duration, set_volume, get_volume
};
use raw_window_handle::HasWindowHandle;

#[tokio::main]
async fn main() {
    let mpv_state = MpvState::new();
    let mpv_clone = mpv_state.mpv.clone(); // Clonamos solo el Arc para el closure

    tauri::Builder::default()
        .setup(move |app| {
            let window = app.get_webview_window("main").unwrap();

            #[cfg(target_os = "windows")]
            if let Ok(handle) = window.window_handle() {
                if let raw_window_handle::RawWindowHandle::Win32(h) = handle.as_raw() {
                    let hwnd = h.hwnd.get() as i64;
                    if let Ok(mpv) = mpv_clone.lock() {
                        let _ = mpv.set_property("wid", hwnd);
                        let _ = mpv.set_property("force-window", "yes");
                    }
                }
            }

            Ok(())
        })
        .manage(mpv_state)
        .invoke_handler(tauri::generate_handler![
            embed_mpv,
            play,
            pause,
            stop,
            loadfile,
            get_position,
            set_position,
            get_duration,
            set_volume,
            get_volume,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}
