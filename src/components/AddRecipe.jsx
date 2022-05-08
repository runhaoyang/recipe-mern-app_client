import { useState, useRef } from "react";
import Loading from "./Loading";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddRecipe = ({ userInfo, isLoggedIn }) => {
  const [recipeName, setRecipeName] = useState("");
  const [recipeCategory, setRecipeCategory] = useState("");
  // Number of ingredients and quantity input to display
  const [ingredientCount, setIngredientCount] = useState(3);
  //   const [textArea, setTextArea] = useState(
  //     "The content of a textarea goes in the value attribute"
  //   );
  const [instructionsCount, setInstructionsCount] = useState(3);
  //   const [item, setItem] = useState({ title: "", image: "" });
  const [inputFile, setInputFile] = useState(null);

  const nameRef = useRef(null);
  const categoryRef = useRef(null);
  // Contains the ingredient names
  const ingredientsRef = useRef([]);
  // Contains the quantity corresponding to each ingredient name
  const quantityRef = useRef([]);
  const instructionsRef = useRef([]);
  // const inputFileRef = useRef(null);
  const formRef = useRef(null);

  const increaseIngredientFields = () => {
    if (ingredientCount === 20) {
      return;
    }
    setIngredientCount(ingredientCount + 1);
  };

  const increaseInstructionsFields = () => {
    setInstructionsCount(instructionsCount + 1);
  };

  const resetInputFields = () => {
    setRecipeName("");
    setRecipeCategory("");

    setIngredientCount(3);
    setInstructionsCount(3);
    ingredientsRef.current = [[], [], []];
    instructionsRef.current = [[], [], []];

    setInputFile(null);
    // inputFileRef.current.value = "";
  };

  const errorNotification = () => {
    toast.error("Recipe name is required.", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const successNotification = () => {
    toast.success(
      "Recipe added to submissions. Needs review before adding to recipes database.",
      {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 10000,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let ingredientList = [];
    let quantityList = [];
    for (let i = 0; i < ingredientsRef.current.length; i++) {
      if (ingredientsRef.current[i].value !== "") {
        ingredientList.push(ingredientsRef.current[i].value);
        quantityList.push(quantityRef.current[i].value);
      }
    }
    let instructionsList = [];
    for (let i = 0; i < instructionsRef.current.length; i++) {
      if (instructionsRef.current[i].value !== "") {
        instructionsList.push(instructionsRef.current[i].value);
      }
    }
    try {
      const sendData = {};
      if (inputFile === null) {
        await Axios.get(
          "https://recipe-mern-app-server.herokuapp.com/submittedRecipes/getLastId"
        ).then(async (res) => {
          sendData.lastId = parseInt(res.data) + 1;
          sendData.postedBy = userInfo.username;
          sendData.recipeName = nameRef.current.value;
          sendData.recipeCategory = categoryRef.current.value;
          sendData.ingredientList = JSON.stringify(ingredientList);
          sendData.quantityList = JSON.stringify(quantityList);
          sendData.instructions = JSON.stringify(instructionsList);
          sendData.date =
            new Date().toLocaleString([], { hour12: true }) +
            " " +
            new Date().toTimeString().slice(9, 17);
          console.log("sendData: ");
          console.log(sendData);

          await Axios.post(
            "https://recipe-mern-app-server.herokuapp.com/submittedRecipes/submit",
            sendData
          )
            .then((res) => {
              console.log(res);
              // Clear all fields
              formRef.current.reset();
              resetInputFields();
              successNotification();
            })
            .catch((error) => {
              console.log(error);
              errorNotification();
              console.log("line 122");
            });
        });
      } else {
        const imageRef = ref(storage, inputFile.name);
        uploadBytes(imageRef, inputFile).then(() => {
          getDownloadURL(imageRef)
            .then((url) => {
              sendData.filePath = url;
            })
            .then(async () => {
              await Axios.get(
                "https://recipe-mern-app-server.herokuapp.com/submittedRecipes/getLastId"
              ).then(async (res) => {
                sendData.lastId = parseInt(res.data) + 1;
                sendData.postedBy = userInfo.username;
                sendData.recipeName = nameRef.current.value;
                sendData.recipeCategory = categoryRef.current.value;
                sendData.ingredientList = JSON.stringify(ingredientList);
                sendData.quantityList = JSON.stringify(quantityList);
                sendData.instructions = JSON.stringify(instructionsList);
                sendData.date =
                  new Date().toLocaleString([], { hour12: true }) +
                  " " +
                  new Date().toTimeString().slice(9, 17);
                sendData.fileName = inputFile.name;
                sendData.fileType = inputFile.type;
                console.log("sendData: ");
                console.log(sendData);

                await Axios.post(
                  "https://recipe-mern-app-server.herokuapp.com/submittedRecipes/submit",
                  sendData
                )
                  .then((res) => {
                    console.log(res);
                    // Clear all fields
                    formRef.current.reset();
                    resetInputFields();
                    successNotification();
                  })
                  .catch((error) => {
                    console.log(error);
                    errorNotification();
                    console.log("line 166");
                  });
              });
            })
            .catch((error) => {
              console.log(error);
            });
          // setInputFile(null);
        });
      }
    } catch (err) {
      console.error(`The error is ${err}`);
      console.log("line 176");
      errorNotification();
    }
  };

  const handleInputFile = (e) => {
    console.log(e.target.files[0]);
    setInputFile(e.target.files[0]);
  };

  return (
    <>
      {isLoggedIn ? (
        <form
          className="recipeForm"
          ref={formRef}
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div>
            <label>
              Name{" "}
              <input
                ref={nameRef}
                type="text"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Category{" "}
              <input
                ref={categoryRef}
                type="text"
                value={recipeCategory}
                onChange={(e) => setRecipeCategory(e.target.value)}
              />
            </label>
          </div>
          {Array.from(Array(ingredientCount)).map((ingredientCount, index) => {
            return (
              <div key={index}>
                <label>
                  Ingredient{" "}
                  <input
                    type="text"
                    className={`IngredientList${index + 1}`}
                    ref={(el) => (ingredientsRef.current[index] = el)}
                  />
                </label>{" "}
                <label>
                  Quantity{" "}
                  <input
                    type="text"
                    className={`quantityList${index}`}
                    ref={(el) => (quantityRef.current[index] = el)}
                  />
                </label>
              </div>
            );
          })}
          <br />
          <div>
            <button type="button" onClick={increaseIngredientFields}>
              Add more ingredients
            </button>
            <br /> <br />
          </div>
          {Array.from(Array(instructionsCount)).map(
            (instructionsCount, index) => {
              return (
                <div key={index}>
                  <label>
                    Instruction {index + 1}
                    <input
                      type="text"
                      className={`Instructions${index + 1}`}
                      ref={(el) => (instructionsRef.current[index] = el)}
                    />
                  </label>{" "}
                </div>
              );
            }
          )}
          <div>
            <br />
            <button type="button" onClick={increaseInstructionsFields}>
              Add more instructions
            </button>
          </div>
          <br />

          <input
            type="file"
            // ref={inputFileRef}
            accept="image/*"
            name="photo"
            onChange={handleInputFile}
          />

          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      ) : (
        <Loading source={"addARecipe"} />
      )}
      <ToastContainer />
    </>
  );
};

export default AddRecipe;
