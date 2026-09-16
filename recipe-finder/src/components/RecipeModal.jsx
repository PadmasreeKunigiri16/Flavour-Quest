import React from "react";
import "./styles/RecipeModal.css";
const RecipeModal=({recipe,onClose}) =>{
    if(!recipe) return null;
    //collect ingredients+measure
    const ingredients =[];
    for(let i=1;i<=20;i++)
    {
        const ingredient=recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if(ingredient&&ingredient.trim()!=""){
            ingredients.push(`${measure?measure:""}${ingredient}`.trim());
        }
    }
    //split the instructions into clean points
 const steps=recipe.strInstructions?recipe.strInstructions.split(/[.\n]/).map((step)=>step.trim()).filter((step)=>step.length >3) : [];
  return (
  <div className="modal" onClick={onClose}>
    <div className="modal-full" onClick={(e)=>e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
            x
        </button>
        <div className="modal-body">
            <div className="modal-image">
                <img
                    src={recipe.strMealThumb || "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"}
                    alt={recipe.strMeal}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80";
                    }}
                />
            </div>
            <div className="modal-details">
                <h2>{recipe.strMeal}</h2>
                <p><strong>Category:</strong>
                {recipe.strCategory}</p>
                <p><strong>Area:</strong>
                {recipe.strArea}</p>
                {
                    ingredients.length>0 &&(
                        <div className="ingredients-section">
                            <h3>Ingredients</h3>
                            <ul>
                                {ingredients.map((item,index)=>(
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )
                }
                {
                    steps.length>0 && (
                        <div className="instructions">
                         <h3>Process:</h3>
                         <ol>
                            {steps.map((step,index)=>(
                                <li key={index}>{step}</li>
                            ))}
                         </ol>
                        </div>
                    )
                }
                {(() => {
                    const videoUrl = (recipe.strYoutube && recipe.strYoutube.includes("watch?v="))
                        ? recipe.strYoutube
                        : `https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.strMeal + " recipe telugu")}`;
                    return (
                        <a
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="youtube-link"
                        >
                            ▶ Watch "{recipe.strMeal}" Recipe Video on YouTube
                        </a>
                    );
                })()}
            </div>
        </div>
    </div>
  </div>);
};
export default RecipeModal;