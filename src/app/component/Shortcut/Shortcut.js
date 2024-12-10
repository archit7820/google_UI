import React, { useState, useEffect } from "react";
import { openDB } from "idb"; // Importing idb
import "./shortcut.scss";

const AddShortcut = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [formData, setFormData] = useState({ name: "", url: "" });
  const [editShortcut, setEditShortcut] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  const DB_NAME = "ShortcutDB";
  const STORE_NAME = "shortcuts";

  // Initialize IndexedDB
  const initDB = async () => {
    return await openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
        }
      },
    });
  };

  // Fetch shortcuts from IndexedDB
  const fetchShortcuts = async () => {
    const db = await initDB();
    const allShortcuts = await db.getAll(STORE_NAME);
    setShortcuts(allShortcuts);
  };

  // Add shortcut to IndexedDB
  const addShortcutToDB = async (shortcut) => {
    const db = await initDB();
    await db.add(STORE_NAME, shortcut);
    fetchShortcuts(); // Refresh local state
  };

  // Edit shortcut in IndexedDB
  const updateShortcutInDB = async (shortcut) => {
    const db = await initDB();
    await db.put(STORE_NAME, shortcut);
    fetchShortcuts(); // Refresh local state
  };

  // Delete shortcut from IndexedDB
  const deleteShortcutFromDB = async (id) => {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
    fetchShortcuts(); // Refresh local state
  };

  useEffect(() => {
    fetchShortcuts();
  }, []);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setFormData({ name: "", url: "" });
    setEditShortcut(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddShortcut = () => {
    if (formData.name && formData.url) {
      if (shortcuts.length < 8) {
        const newShortcut = { ...formData };
        addShortcutToDB(newShortcut);
        handleClose();
      } else {
        alert("Maximum limit of 8 shortcuts reached!");
      }
    } else {
      alert("Please fill in both fields!");
    }
  };

  const handleEditShortcut = (shortcut) => {
    setEditShortcut(shortcut);
    setFormData({ name: shortcut.name, url: shortcut.url });
    setIsOpen(true);
    setMenuOpen(null); // Close the menu
  };

  const handleSaveEdit = () => {
    if (formData.name && formData.url) {
      const updatedShortcut = { ...editShortcut, name: formData.name, url: formData.url };
      updateShortcutInDB(updatedShortcut);
      handleClose();
    } else {
      alert("Please fill in both fields!");
    }
  };

  const handleMenuToggle = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const getFavicon = (url) => {
    try {
      const domain = new URL(url).origin;
      return `${domain}/favicon.ico`;
    } catch {
      return "https://via.placeholder.com/32"; // Placeholder if favicon is unavailable
    }
  };

  return (
    <div className="add_shortcut-container">
      <div className="shortcut">
        {shortcuts.map((shortcut) => (
          <div className="shortcut_section_menu_edit" key={shortcut.id}>

          
             <div className="shortcut_section">
            <div
              className="shortcut_added_div"
              onClick={() => window.open(shortcut.url, "_blank")}
            >
              <img className="short_img" src={getFavicon(shortcut.url)} alt={shortcut.name} />
            </div>

            <div className="shortcut_headline">
              {shortcut.name.length > 14 ? shortcut.name.slice(0, 13) + "..." : shortcut.name}
            </div>
            </div>

            <div className="shortcut_menu">
              <div className="menu_icon" onClick={() => handleMenuToggle(shortcut.id)}>
                &#8942;
              </div>
              {menuOpen === shortcut.id && (
                <div className="menu_dropdown">
                  <div 
                  onClick={() => handleEditShortcut(shortcut)}>Edit shortcut</div>
                  <div onClick={() => deleteShortcutFromDB(shortcut.id)}>Remove</div>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>

      <div className="sortcut_img_headline">
        <div className="shortcut_add_div" onClick={handleOpen}>
          <img src="./add_shortcut.svg" alt="" />
        </div>
        <div className="shortcut_headline">Add shortcut</div>
      </div>

      {isOpen && (
        <div className="overlay">
          <div className="modal">
            <div>{editShortcut ? "Edit Shortcut" : "Add Shortcut"}</div>
            <div>
              <div className="parameter">Name</div>
              <input
                type="text"
                name="name"
                id="input_parameter"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="parameter">URL</div>
              <input
                type="url"
                name="url"
                id="input_parameter"
                value={formData.url}
                onChange={handleChange}
              />
            </div>
            <div className="create_buttons">
              <div className="submit_button" onClick={handleClose}>
                Cancel
              </div>
              <div
                className={`reject_button ${formData.url ? "active" : "disabled"}`}
                onClick={editShortcut ? handleSaveEdit : handleAddShortcut}
              >
                {editShortcut ? "Save" : "Done"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddShortcut;
