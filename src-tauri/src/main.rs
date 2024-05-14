// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use walkdir::WalkDir;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn rename(old: &str, new: &str) -> Result<(), String> {
    fs::rename(old, new).map_err(|err| err.to_string())?;

    Ok(())
}

#[tauri::command]
fn exists(path: &str) -> bool {
    fs::metadata(path).is_ok()
}

#[tauri::command]
fn is_file(path: &str) -> bool {
    exists(path) && fs::metadata(path).unwrap().is_file()
}

#[tauri::command]
fn read_dir(path: &str) -> Result<Vec<String>, String> {
    let mut files = Vec::new();

    for entry in WalkDir::new(path) {
        let entry = entry.map_err(|err| err.to_string())?;

        if entry.file_type().is_file() {
            let file_path = match entry.path().to_str() {
                Some(path) => path,
                None => continue,
            };

            files.push(file_path.to_string());
        }
    }

    Ok(files)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![rename, exists, is_file, read_dir])
        .plugin(tauri_plugin_store::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
