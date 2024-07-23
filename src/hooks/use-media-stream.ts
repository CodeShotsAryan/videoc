
import {useState , useEffect} from 'react'

const useMediaStream = ()=>{
    const [stream,setStream] = useState<MediaStream | null>(null)
    useEffect(()=>{
        const getMediaStream = async ()=>{
            try {
            const mediaStream = await  navigator.mediaDevices.getUserMedia({
                video : true ,
                audio : true
            })
            setStream(mediaStream)
            } catch (error) {
                console.log(`error accessing media devices ${error}`)
            }
        }
        getMediaStream();
    }, [])

    return stream ;
}
export default useMediaStream;