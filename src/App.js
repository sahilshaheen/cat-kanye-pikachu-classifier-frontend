import "./App.css";
import { useDropzone } from "react-dropzone";
import { useCallback, useMemo, useState } from "react";
import axios from "axios";

const baseStyle = {
  minWidth: "40vw",
  padding: "2rem",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function App() {
  const [src, setSrc] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      setSrc(URL.createObjectURL(file));
      setFile(file);
    });
  }, []);

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    isDragActive,
  } = useDropzone({
    accept: "image/*",
    maxFiles: 1,
    onDrop,
    maxSize: 5e+6,
  });

  /* DROPZONE STYLING */
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const onSubmit = async () => {
    const formData = new FormData();
    formData.append("image", file);
    setIsLoading(true);
    try {
      const res = await axios.post(
        "https://stormy-sands-03353.herokuapp.com/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsLoading(false);
      setResult({ ...res.data, success: true });
    } catch {
      setIsLoading(false);
      setResult({ success: false });
    }
  };

  return (
    <div className="App">
      <main className="main">
        <h1>Is it a cat, Kanye or Pikachu?</h1>
        {/* IF ObjectURL is created, show preview else show dropzone */}
        {src ? (
          <div>
            {/* IMAGE PREVIEW */}
            <img src={src} alt="uploaded-file" width="500" />
            {/* Hide buttons when loading result */}
            {!loading && <div>
              <button
                onClick={() => {
                  setResult(null);
                  setSrc("");
                }}
              >
                Clear
              </button>
              {/* Hide submit button if request is sent */}
              {!result && (
                <button style={{ marginLeft: 10 }} onClick={onSubmit}>
                  Submit
                </button>
              )}
            </div>}
            {/* Result */}
            {result && (
              <p>
                {/* Result condition */}
                {result.success
                  ? `I am ${(parseFloat(result.score) * 100).toFixed(
                      2
                    )}% sure that's ${result.label}`
                  : "Oops, something went wrong! Try another image perhaps"}
              </p>
            )}
            {/* Loading */}
            {loading && (<p>Hold your horses...</p>)}
          </div>
        ) : (
          <section className="container">
            <div {...getRootProps({ style })}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the file here</p>
              ) : (
                <p>Drag 'n' drop an image here, or click to select (Max. 5MB)</p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
