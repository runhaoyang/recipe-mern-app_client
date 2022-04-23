import ReactDOM from "react-dom";
import SubmittedRecipesTable from "./SubmittedRecipesTable";

const SubmittedRecipesPortal = ({
  isOpen,
  onClose,
  selectedRow,
  modalColumns,
}) => {
  //@todo 4/16 - Scratch the table idea and instead render full details for each recipe in the submitttedRecipe portal such as ID, name, category, author, date added, all ingredients: amount, instructions into a cleanly formatted grid view? maybe

  let renderFullIngredientsList;
  let recipeName;
  let recipeCategory;
  let recipeInstructionsList;
  let recipeId;
  let dateAdded;
  let postedBy;
  let recipeImagePath;
  if (selectedRow.original) {
    if (selectedRow.original.hasOwnProperty("filePath")) {
      recipeImagePath = selectedRow.original.filePath;
    } else {
      recipeImagePath = `uploads/2022-04-23-No-Image-Placeholder.svg.png`;
    }

    console.log(selectedRow.original);
    postedBy = selectedRow.original.postedBy;
    recipeId = selectedRow.original.idMeal;
    dateAdded = selectedRow.original.date;
    recipeName = selectedRow.original.strMeal;
    recipeCategory = selectedRow.original.strCategory;
    const ingredientsList = selectedRow.original.strIngredients;
    const quantityList = selectedRow.original.strQuantity;
    const fullIngredientsList = [];
    recipeInstructionsList = selectedRow.original.strInstructions;

    for (let i = 0; i < ingredientsList.length; i++) {
      if (quantityList[i] === "") {
        fullIngredientsList[i] = ingredientsList[i];
      } else {
        fullIngredientsList[i] = ingredientsList[i] + ": " + quantityList[i];
      }
    }

    renderFullIngredientsList = fullIngredientsList.map((pair, index) => {
      return (
        <li style={{ listStyle: "none" }} key={index}>
          {pair}
        </li>
      );
    });
  }

  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="portal">
      {console.log(selectedRow.original)}

      <button style={{ marginTop: "1em" }} onClick={onClose}>
        Close
      </button>
      <div className="submittedRecipesPortalContainer">
        <h3>
          {recipeName} <span> ({recipeCategory})</span>
        </h3>
        <img
          style={{
            maxWidth: "12em",
            maxHeight: "12em",
            minWidth: "12em",
            minHeight: "12em",
          }}
          src={`https://recipe-mern-app-server.herokuapp.com/${recipeImagePath}`}
          alt=""
        />
        <h3 style={{ textDecoration: "underline" }}> Ingredients </h3>
        {renderFullIngredientsList}
        <br />
        <h3 style={{ textDecoration: "underline" }}> Instructions </h3>
        {recipeInstructionsList.map((instruction, index) => {
          return (
            <li style={{ listStyle: "none" }} key={index}>
              {instruction}
            </li>
          );
        })}
      </div>
    </div>,
    document.body
  );
};

export default SubmittedRecipesPortal;
