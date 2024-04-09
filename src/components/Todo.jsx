import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';

function Todo({
  id,
  name,
  completed,
  priority,
  deadline,
  repeat,
  toggleTaskCompleted,
  deleteTask,
  editTask,
  addPhotoToTask,
  taskPhoto,
}) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  const [newPriority, setNewPriority] = useState(priority);
  const [newDeadline, setNewDeadline] = useState(deadline);
  const [newRepeat, setNewRepeat] = useState(repeat);
  const [photo, setPhoto] = useState(taskPhoto || null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const webcamRef = useRef(null);

  const handleEdit = () => {
    document.querySelector(".c-cb").style.paddingLeft = "0";
    setEditing(true);
  };

  const handleSaveEdit = () => {
    editTask(id, newName, newPriority, newDeadline, newRepeat);
    document.querySelector(".c-cb").style.paddingLeft = "40px";
    setEditing(false);

    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.priority === "High" && b.priority !== "High") {
        return -1; 
      } else if (a.priority !== "High" && b.priority === "High") {
        return 1; 
      } else {
        return 0; 
      }
    });
  
    setTasks(sortedTasks);
  };
  
  
  

  const handleCancelEdit = () => {
    setNewName(name);
    setNewPriority(priority);
    setNewDeadline(deadline);
    setNewRepeat(repeat);
    setEditing(false);
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setNewPriority(e.target.value);
  };

  const handleDeadlineChange = (e) => {
    setNewDeadline(e.target.value);
  };

  const handleRepeatChange = (e) => {
    setNewRepeat(e.target.value);
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
    addPhotoToTask(id, imageSrc);
    setShowCameraModal(false);
  };

  return (
    <li className="todo stack-small">
      {/* Task name and checkbox */}
      <div className="c-cb">
        <input
          id={id}
          type="checkbox"
          defaultChecked={completed}
          onChange={() => toggleTaskCompleted(id)}
        />
        {editing ? (
          <input
            type="text"
            value={newName}
            onChange={handleNameChange}
            autoFocus
          />
        ) : (
          <label className="todo-label" htmlFor={id}>
            {name}
          </label>
        )}
      </div>

      {/* Task properties */}
      <div className="task-properties">
        <span>Priority:</span>
        {editing ? (
          <select value={newPriority} onChange={handlePriorityChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        ) : (
          <span>{priority}</span>
        )}

        <span>Deadline:</span>
        {editing ? (
          <input type="date" value={newDeadline} onChange={handleDeadlineChange} />
        ) : (
          <span>{deadline}</span>
        )}

        <span>Repeat:</span>
        {editing ? (
          <select value={newRepeat} onChange={handleRepeatChange}>
            <option value="None">None</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        ) : (
          <span>{repeat}</span>
        )}
      </div>

      {/* Task buttons */}
      <div className="btn-group">
        {/* Edit button */}
        {editing ? (
          <>
            <button className="btn" onClick={handleSaveEdit}>
              Save
            </button>
            <button className="btn" onClick={handleCancelEdit}>
              Cancel
            </button>
          </>
        ) : (
          <button className="btn" onClick={handleEdit}>
            Edit
          </button>
        )}

        {/* Take photo button */}
        <button className="btn" onClick={() => setShowCameraModal(true)}>
          Take Photo
        </button>

        {/* View photo button */}
        {photo && (
          <button
            className="btn btn__secondary"
            onClick={() => setShowPhotoModal(true)}
          >
            View Photo
          </button>
        )}

        {/* Delete button */}
        <button className="btn btn__danger" onClick={() => deleteTask(id)}>
          Delete
        </button>
      </div>

      {/* Camera modal */}
      {showCameraModal && (
        <div className="modal">
          <div className="modal-content">
            <Webcam
              audio={false}
              height={200}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={220}
              videoConstraints={{ facingMode: 'user' }}
            />
            <button className="btn-modal btn-save" onClick={handleCapture}>
              Save Photo
            </button>
            <button
              className="btn-modal btn-cancel"
              onClick={() => setShowCameraModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Photo modal */}
      {showPhotoModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowPhotoModal(false)}>
              &times;
            </span>
            <img
              src={photo}
              alt="Task"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>
      )}
    </li>
  );
}

export default Todo;