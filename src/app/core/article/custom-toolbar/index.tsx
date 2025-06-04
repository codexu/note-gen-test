import Vditor from 'vditor'
import Mark from "./mark";
import Question from "./question";
import Continue from "./continue";
import Polish from "./polish";
import Eraser from "./eraser";
import Translation from "./translation";

export default function CustomToolbar({editor}: {editor?: Vditor}) {
  return <div className="h-12 w-full border-b items-center px-2 gap-1 justify-between hidden">
    <Mark editor={editor} />
    <Question editor={editor} />
    <Continue editor={editor} />
    <Polish editor={editor} />
    <Eraser editor={editor} />
    <Translation editor={editor} />
  </div>
}