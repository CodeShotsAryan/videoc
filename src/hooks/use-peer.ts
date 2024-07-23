// this hook will manage the peer connection 
// and handle signaling through  Socket.IO

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const usePeerConnection = (signalingServerUrl: string) => {
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    const socketClient = io(signalingServerUrl);

    socketClient.on('offer', (data) => {
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      pc.createAnswer().then((answer) => {
        pc.setLocalDescription(answer);
        socketClient.emit('answer', { sdp: answer });
      });
    });

    socketClient.on('answer', (data) => {
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
    });

    socketClient.on('ice-candidate', (data) => {
      pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketClient.emit('ice-candidate', { candidate: event.candidate });
      }
    };

    peerConnection.current = pc;
    socket.current = socketClient;

    return () => {
      pc.close();
      socketClient.close();
    };
  }, [signalingServerUrl]);

  return { peerConnection: peerConnection.current, socket: socket.current };
};

export default usePeerConnection;
