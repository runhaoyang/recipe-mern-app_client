import SearchContainer from "./SearchContainer";

const Loading = ({ source }) => {
  let message;
  if (source === "recipes") {
    message = (
      <div className="loadingPage">
        <h2>Fetching recipes ... </h2>
      </div>
    );
  } else if (source === "collections") {
    message = (
      <div className="loadingPage">
        <h2> Please login to view your collections.</h2>
      </div>
    );
  } else if (source === "collectionsEmptyArray") {
    message = (
      <div className="loadingPage">
        <h2>No results found.</h2>
      </div>
    );
  } else if (source === "addARecipe") {
    message = (
      <div className="loadingPage">
        <h2>Please login to add a recipe.</h2>
      </div>
    );
  } else if (source === "home") {
    message = (
      <div className="loadingPage">
        <h2>
          This is the home page. {<br />} Please log in to access your
          collections, or to add a recipe.
        </h2>
      </div>
    );
  } else if (source === "users") {
    message = (
      <div className="loadingPage">
        <h2>Fetching users ... </h2>
      </div>
    );
  }

  return <div>{message}</div>;
};

export default Loading;
