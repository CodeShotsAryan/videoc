"use client"
import React,{useEffect,useRef,useState} from "react";
import useMediaStream from "@/hooks/use-media-stream";
import usePeerConnection from "@/hooks/use-peer";

const Meeting =()=>{
    const localVideoRef = useRef<HTMLVideoElement>(null)
    const remoteVideoRef = useRef<HTMLVideoElement>(null)
    const stream = useMediaStream();
    const {peerConnection ,socket} = usePeerConnection('http://localhost:3000')
    useEffect(() => {
        if (localVideoRef.current && stream) {
          localVideoRef.current.srcObject = stream;
        }
    
        if (peerConnection && stream) {
          stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
        }
    
        if (peerConnection) {
          peerConnection.ontrack = (event) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = event.streams[0];
            }
          };
        }
      }, [stream, peerConnection]);
      
      const handleStartCall = async () => {
        if (peerConnection) {
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          if (socket) {
            socket.emit('offer', { sdp: offer });
          }
        }
      };
    
      return (
        <div>
          <h1>Meeting</h1>
          <video ref={localVideoRef} autoPlay playsInline />
          <video ref={remoteVideoRef} autoPlay playsInline />
          <button onClick={handleStartCall}>Start Call</button>
        </div>
      );
}

export default Meeting