import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./AddProjectModalComponent.css";
const AddProjectModalComponent = ({ isShowing, hide }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [participants, setParticipants] = useState([]);

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const styles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: "1px dotted pink",
      color: state.isSelected ? "red" : "blue",
      padding: 10,
    }),
    control: () => ({
      // none of react-select's styles are passed to <Control />
      width: 500,
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = "opacity 300ms";

      return { ...provided, opacity, transition };
    },
  };

  return isShowing ? (
    <div className="addProjectModalComponent">
      <div className="addProjectModalComponent__container">
        <div className="addProjectModalComponent__header">
          <h3>Aggiungi un progetto</h3>
          <span className="addProjectModalComponent__error">{error}</span>
        </div>
        <div className="addProjectModalComponent__content">
          <form>
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Inserisci il nome del progetto"
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <Select
              isMulti={true}
              defaultValue={participants}
              onChange={setParticipants}
              options={options}
              styles={styles}
            />
            <div className="addProjectModalComponent__btn" onClick={(e) => {}}>
              Aggiungi
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : null;
};

export default AddProjectModalComponent;
