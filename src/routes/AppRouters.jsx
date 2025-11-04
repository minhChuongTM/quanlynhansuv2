import React from "react";
import { Route, Routes } from "react-router-dom"
import EmployeeList from "../page/EmployeeList";
import EmployeeForm from "../page/EmployeeForm";

function AppRouters() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<EmployeeList />} />
                <Route path="/addEmployees" element={<EmployeeForm />} />
                <Route path="/employee/edit/:id" element={<EmployeeForm />} />
                <Route path="/employee/delete/:id" element={<EmployeeList />} />
            </Routes>
        </div>
    );
}

export default AppRouters;
