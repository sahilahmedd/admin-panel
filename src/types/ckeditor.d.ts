declare module "@ckeditor/ckeditor5-react" {
  import { ComponentType } from "react";

  export const CKEditor: ComponentType<{
    editor: any;
    data?: string;
    id?: string;
    config?: any;
    onReady?: (editor: any) => void;
    onChange?: (event: any, editor: any) => void;
    onBlur?: (event: any, editor: any) => void;
    onFocus?: (event: any, editor: any) => void;
    onError?: (event: any, editor: any) => void;
    disabled?: boolean;
  }>;
}

declare module "@ckeditor/ckeditor5-build-classic" {
  const ClassicEditor: any;
  export default ClassicEditor;
}
