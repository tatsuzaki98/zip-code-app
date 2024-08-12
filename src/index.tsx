import FormComponent from "./form";
import ResultComponent from "./result";
import "./index.css";

const IndexComponent = () => {
  return (
    <main className="max-w-lg mx-auto space-y-8 p-4">
      <FormComponent />
      <ResultComponent />
    </main>
  );
};

export default IndexComponent;
