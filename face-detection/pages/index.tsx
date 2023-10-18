import { Inter } from 'next/font/google'
import FaceDetection from '../components/FaceDetection';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className="container mx-auto">
      <FaceDetection />
    </div>
  )
}
