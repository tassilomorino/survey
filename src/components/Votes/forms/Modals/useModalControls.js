import { useState } from "react";

export default function useModalControls() {
    const [state, setState] = useState(false)
    const toggle = () => setState(p => !p)
    return [state, toggle]
}