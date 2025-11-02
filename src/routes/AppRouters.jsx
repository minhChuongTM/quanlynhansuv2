import React from "react";
import { Route, Routes } from "react-router-dom";
import EmployeeList from "../page/EmployeeList";
import EmployeeForm from "../page/EmployeeForm";
import EmployeeDetail from "../page/EmployeeDetail";

function AppRouters() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<EmployeeList />} />
                <Route path="/addEmployee" element={<EmployeeForm />} />
                <Route path="/editEmployee/:id" element={<EmployeeForm />} />
                <Route path="/employee-remove/:id" element={<EmployeeList />} />
                <Route path="/view/:id" element={<EmployeeDetail />} />
            </Routes>
        </div>
    );
}

export default AppRouters;
