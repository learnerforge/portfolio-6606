import { useState } from 'react'
import Boot from './os/Boot'
import Desktop from './os/Desktop'

export default function App() {
  const [booted, setBooted] = useState(false)

  return (
    <>
      {!booted && <Boot onDone={() => setBooted(true)} />}
      <Desktop />
    </>
  )
}