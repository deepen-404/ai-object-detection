// import { useEffect, useState } from 'react';
// import * as faceApi from 'face-api.js';

// export function useLoadModels() {
//   const [modelsLoaded, setModelsLoaded] = useState(false);

//   useEffect(() => {
//     const loadModels = async () => {
//       const MODEL_URL = `/models`;

//       try {
//         await Promise.all([
//           faceApi.nets.tinyFaceDetector.loadFromUri(
//             `${MODEL_URL}/tiny_face_detector`
//           ),
//           faceApi.nets.faceLandmark68Net.loadFromUri(
//             `${MODEL_URL}/face_landmark_68`
//           ),
//           faceApi.nets.faceRecognitionNet.loadFromUri(
//             `${MODEL_URL}/face_recognition`
//           ), 
//           faceApi.nets.faceExpressionNet.loadFromUri(
//             `${MODEL_URL}/face_expression`
//           ),
//           faceApi.nets.ageGenderNet.loadFromUri(
//             `${MODEL_URL}/age_gender_model`
//           ),
//           faceApi.nets.ssdMobilenetv1.loadFromUri(
//             `${MODEL_URL}/ssd_mobilenetv1`
//           ),
//         ]);
//         setModelsLoaded(true);
//       } catch (err) {
//         console.error('Error loading models:', err);
//       }
//     };

//     loadModels();
//   }, []);

//   return modelsLoaded;
// }
