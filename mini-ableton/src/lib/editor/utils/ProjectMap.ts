import { AudioClip, AudioTrack } from "$lib/editor/api/audio";
import project from "../stores/project";

export const blobToBase64 = (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      resolve(reader.result);
    };
  });
};



/**
 * Convert BASE64 to BLOB
 * @param base64Image Pass Base64 image data to convert into the BLOB
 */
function convertBase64ToBlob(base64Image: string) {
  // Split into two parts
  const parts = base64Image.split(';base64,');

  // Hold the content type
  const imageType = parts[0].split(':')[1];

  // Decode Base64 string
  const decodedData = window.atob(parts[1]);

  // Create UNIT8ARRAY of size same as row data length
  const uInt8Array = new Uint8Array(decodedData.length);

  // Insert all character code into uInt8Array
  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i);
  }

  // Return BLOB image after conversion
  return new Blob([uInt8Array], { type: imageType });
}

export function renderNewProject(data) {
    return project.update((project) => {        
        for (let i = 0; i < data.tracks.length; i++) {       
            const track = new AudioTrack();
              track.description = data.tracks[i].description;
              track.enabled = data.tracks[i].enabled;
              track.height = data.tracks[i].height;
              track.id = data.tracks[i].id;        
              //NOTE ???
              track.mod.parameters = data.tracks[i].mod.parameters; 
              track.name = data.tracks[i].name;        
              for (let c = 0; c < data.tracks[i].clips.length; c++) {
                    const blob = convertBase64ToBlob(data.tracks[i].clips[c].blob)
                    data.tracks[i].clips[c].blob = blob;
                    const clip = new AudioClip(            
                      data.tracks[i].clips[c].name,
                      data.tracks[i].clips[c].blob,
                      data.tracks[i].clips[c].start,
                      data.tracks[i].clips[c].length,
                      data.tracks[i].clips[c].extent,
                      data.tracks[i].clips[c].extentPast,
                    );                                      
                    track.clips.push(clip);
              }
            project.tracks.push(track);
          }
        return project;
    })    
}

export function renderNewURProject(data) { 
    return project.update((project) => {              
        for (let i = 0; i < data.tracks.length; i++) {       
            const track = new AudioTrack();
              track.description = data.tracks[i].description;
              track.enabled = data.tracks[i].enabled;
              track.height = data.tracks[i].height;
              track.id = data.tracks[i].id;                  
              //NOTE ???
              track.mod.parameters = data.tracks[i].mod.parameters;              
              track.name = data.tracks[i].name;
        
            for (let c = 0; c < data.tracks[i].clips.length; c++) {
                const clip = new AudioClip(            
                  data.tracks[i].clips[c].name,
                  data.tracks[i].clips[c].blob,
                  data.tracks[i].clips[c].start,
                  data.tracks[i].clips[c].length,
                  data.tracks[i].clips[c].extent,
                  data.tracks[i].clips[c].extentPast,
                );
                
                track.clips.push(clip);
            }        
            project.tracks.push(track);
          }        
      
        return project;
    })    
}