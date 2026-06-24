"use client";

import { useState, useEffect } from "react";
import "./admin.css";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    role: "PRESCRIPTION"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Error al obtener usuarios");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear usuario");
      }

      setFormData({ username: "", name: "", password: "", role: "PRESCRIPTION" });
      await fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Está seguro de eliminar este usuario?")) return;
    
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar usuario");
      await fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <div className="admin-container"><div className="loading">Cargando...</div></div>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Panel de Administración</h1>
      <p className="admin-subtitle">Gestión de usuarios y roles</p>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-content">
        <div className="admin-card">
          <h2>Crear Nuevo Usuario</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Usuario (Login)</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Contraseña</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="PRESCRIPTION">Asistente de Prescripción</option>
                  <option value="ADMISSION">Asistente de Ingreso Clínico</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
            </div>
            
            <button type="submit" disabled={isCreating} className="btn-primary">
              {isCreating ? "Creando..." : "Crear Usuario"}
            </button>
          </form>
        </div>

        <div className="admin-card">
          <h2>Usuarios Registrados</h2>
          <div className="table-responsive">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Fecha Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td><strong>{user.username}</strong></td>
                    <td>{user.name || "-"}</td>
                    <td>
                      <span className={`role-badge ${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      {user.username !== "admin" && (
                        <button onClick={() => handleDelete(user.id)} className="btn-danger-sm">
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
