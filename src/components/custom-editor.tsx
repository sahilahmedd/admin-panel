/**
 * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
 * https://ckeditor.com/ckeditor-5/builder/?utm_medium=email&utm_source=pardot&utm_campaign=free_onboarding#installation/NoJgNARCB0Bs0AYKQIwHYCsBmEDZYBYNMsEUEFiNKCQUtYAOFAlRrNdNR7gTlmQQApgDtkCMMBRgJE6dIQBdSIwRChAIywaIioA=
 */

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../app/ckeditor.css";

interface CustomEditorProps {
  data: string;
  onChange: (html: string) => void;
}

export default function CustomEditor({ data, onChange }: CustomEditorProps) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={data || ""}
      onReady={(editor) => {
        // You can store the "editor" and use when it is needed.
        console.log("Editor is ready to use!", editor);
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
      onBlur={(event, editor) => {
        console.log("Blur.", editor);
      }}
      onFocus={(event, editor) => {
        console.log("Focus.", editor);
      }}
      config={{
        toolbar: {
          items: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "bold",
            "italic",
            "|",
            "link",
            "uploadImage",
            "insertTable",
            "blockQuote",
            "|",
            "bulletedList",
            "numberedList",
            "|",
            "outdent",
            "indent",
          ],
        },
        image: {
          toolbar: [
            "imageStyle:inline",
            "imageStyle:block",
            "imageStyle:side",
            "|",
            "toggleImageCaption",
            "imageTextAlternative",
          ],
        },
      }}
    />
  );
}

/**
 * This function exists to remind you to update the config needed for premium features.
 * The function can be safely removed. Make sure to also remove call to this function when doing so.
 */
// function configUpdateAlert(config) {
//   if (configUpdateAlert.configUpdateAlertShown) {
//     return;
//   }

//   const isModifiedByUser = (currentValue, forbiddenValue) => {
//     if (currentValue === forbiddenValue) {
//       return false;
//     }

//     if (currentValue === undefined) {
//       return false;
//     }

//     return true;
//   };

//   const valuesToUpdate = [];

//   configUpdateAlert.configUpdateAlertShown = true;

//   if (!isModifiedByUser(config.licenseKey, "<YOUR_LICENSE_KEY>")) {
//     valuesToUpdate.push("LICENSE_KEY");
//   }

//   if (
//     !isModifiedByUser(
//       config.cloudServices?.tokenUrl,
//       "<YOUR_CLOUD_SERVICES_TOKEN_URL>"
//     )
//   ) {
//     valuesToUpdate.push("CLOUD_SERVICES_TOKEN_URL");
//   }

//   if (valuesToUpdate.length) {
//     window.alert(
//       [
//         "Please update the following values in your editor config",
//         "to receive full access to Premium Features:",
//         "",
//         ...valuesToUpdate.map((value) => ` - ${value}`),
//       ].join("\n")
//     );
//   }
// }
