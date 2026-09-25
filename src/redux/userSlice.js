
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "userSlice",
    initialState: {
        users: JSON.parse(localStorage.getItem("users")) || [],
        user: JSON.parse(localStorage.getItem("user")) || null,
        isAuthenticated: JSON.parse(localStorage.getItem("isAuthenticated")) || false,
        appointments: JSON.parse(localStorage.getItem("appointments")) || [],
        doctors: JSON.parse(localStorage.getItem("doctors")) || [],
    },
    reducers: {
        userRegister: (state, action) => {
            state.users.push(action.payload);
            localStorage.setItem("users", JSON.stringify(state.users));
        },

        userLogin: (state, action) => {
            const {
                email,
                password
            } = action.payload;

            const existingUser = state.users.find(
                (user) =>
                    user.email === email &&
                    user.password === password
            );

            if (existingUser) {
                state.user = existingUser;
                state.isAuthenticated = true;

                localStorage.setItem(
                    "user",
                    JSON.stringify(existingUser)
                );

                localStorage.setItem(
                    "isAuthenticated",
                    JSON.stringify(true)
                );
            } else {
                state.user = null;
                state.isAuthenticated = false;
            }
        },

        userLogout: (state) => {
            state.user = null;
            state.isAuthenticated = false;

            localStorage.removeItem("user");

            localStorage.setItem(
                "isAuthenticated",
                JSON.stringify(false)
            );
        },

        updaterole: (state, action) => {
            const userIndex = state.users.findIndex(
                (u) =>
                    u.id === action.payload.userId
            );

            if (userIndex !== -1) {
                state.users[userIndex].role =
                    action.payload.role;

                localStorage.setItem(
                    "users",
                    JSON.stringify(state.users)
                );
            }

            if (
                state.user &&
                action.payload.userId === state.user.id
            ) {
                state.user.role =
                    action.payload.role;

                localStorage.setItem(
                    "user",
                    JSON.stringify(state.user)
                );
            }
        },

        updateStatus: (state, action) => {
            const userIndex = state.users.findIndex(
                (u) =>
                    u.id === action.payload.userId
            );

            if (userIndex !== -1) {
                state.users[userIndex].status =
                    action.payload.status;

                localStorage.setItem(
                    "users",
                    JSON.stringify(state.users)
                );
            }

            if (
                state.user &&
                state.user.id === action.payload.userId &&
                action.payload.status === false
            ) {
                state.user = null;
                state.isAuthenticated = false;

                localStorage.removeItem("user");

                localStorage.setItem(
                    "isAuthenticated",
                    JSON.stringify(false)
                );
            }
        },

        addDoctor: (state, action) => {
            state.doctors.push(action.payload);

            localStorage.setItem(
                "doctors",
                JSON.stringify(state.doctors)
            );
        },

        addAppointment: (state, action) => {
            state.appointments.push(action.payload);

            localStorage.setItem(
                "appointments",
                JSON.stringify(state.appointments)
            );
        },

        updateAppointmentStatus: (state, action) => {
            const appointment = state.appointments.find(
                (appointment) =>
                    appointment.id === action.payload.id
            );

            if (appointment) {
                appointment.status =
                    action.payload.status;

                localStorage.setItem(
                    "appointments",
                    JSON.stringify(state.appointments)
                );
            }
        },

        removeAppointment: (state, action) => {
            state.appointments =
                state.appointments.filter(
                    (appointment) =>
                        appointment.id !== action.payload
                );

            localStorage.setItem(
                "appointments",
                JSON.stringify(state.appointments)
            );
        },updateDoctorProfile: (state, action) => {

    const updatedDoctor = action.payload;

    // Update doctors array
    const doctorIndex = state.doctors.findIndex(
        (doctor) => doctor.id === updatedDoctor.id
    );

    if (doctorIndex !== -1) {
        state.doctors[doctorIndex] = updatedDoctor;

        localStorage.setItem(
            "doctors",
            JSON.stringify(state.doctors)
        );
    }


    // Update users array
    const userIndex = state.users.findIndex(
        (user) => user.id === updatedDoctor.id
    );

    if (userIndex !== -1) {

        state.users[userIndex] = {
            ...state.users[userIndex],

            fullname: updatedDoctor.fullname,
            email: updatedDoctor.email,
            password: updatedDoctor.password,
            role: "Doctor",
            status: true,
        };

        localStorage.setItem(
            "users",
            JSON.stringify(state.users)
        );
    }


    // Update currently logged-in user
    if (
        state.user &&
        state.user.id === updatedDoctor.id
    ) {

        state.user = {
            ...state.user,

            fullname: updatedDoctor.fullname,
            email: updatedDoctor.email,
            password: updatedDoctor.password,
            role: "Doctor",
            status: true,
        };

        localStorage.setItem(
            "user",
            JSON.stringify(state.user)
        );
    }
},
removeDoctor: (state, action) => {
    const {
        doctorId,
        reason
    } = action.payload;

    // Deactivate doctor profile
    const doctorIndex = state.doctors.findIndex(
        (doctor) => doctor.id === doctorId
    );

    if (doctorIndex !== -1) {
        state.doctors[doctorIndex].isAvailable = false;
        state.doctors[doctorIndex].status = "Inactive";
        state.doctors[doctorIndex].removalReason = reason;
        state.doctors[doctorIndex].removedAt =
            new Date().toISOString();

        localStorage.setItem(
            "doctors",
            JSON.stringify(state.doctors)
        );
    }

    // Deactivate doctor account
    const userIndex = state.users.findIndex(
        (user) => user.id === doctorId
    );

    if (userIndex !== -1) {
        state.users[userIndex].status = false;
        state.users[userIndex].doctorRemovalReason = reason;
        state.users[userIndex].doctorRemovedAt =
            new Date().toISOString();

        localStorage.setItem(
            "users",
            JSON.stringify(state.users)
        );
    }

    // Cancel Pending and Confirmed appointments
    state.appointments = state.appointments.map(
        (appointment) => {
            if (appointment.doctorId !== doctorId) {
                return appointment;
            }

            // Keep Completed and already Cancelled appointments unchanged
            if (
                appointment.status === "Completed" ||
                appointment.status === "Cancelled"
            ) {
                return appointment;
            }

            return {
                ...appointment,
                status: "Cancelled",

                cancellationReason:
                    reason ===
                    "Doctor removed their own profile"
                        ? "Doctor removed their own profile"
                        : "Doctor removed by administrator",

                doctorRemovalReason: reason,
                cancelledAt: new Date().toISOString()
            };
        }
    );

    localStorage.setItem(
        "appointments",
        JSON.stringify(state.appointments)
    );

    // Update currently logged-in user
    // DO NOT LOG OUT THE DOCTOR
    if (
        state.user &&
        state.user.id === doctorId
    ) {
        state.user = {
            ...state.user,
            status: false
        };

        localStorage.setItem(
            "user",
            JSON.stringify(state.user)
        );
    }
}
,reactivateDoctor: (state, action) => { const { userId, doctorData } = action.payload; /* * Find existing user account */ 
const userIndex = state.users.findIndex( (user) => user.id === userId ); if (userIndex !== -1) { state.users[userIndex] = 
    { ...state.users[userIndex], fullname: doctorData.fullname, email: doctorData.email, password: doctorData.password, role: "Doctor", status: true };
     localStorage.setItem( "users", JSON.stringify( state.users ) ); } /* * Check whether an old doctor * profile already exists. */ 
     const doctorIndex = state.doctors.findIndex( (doctor) => doctor.id === userId ); 
     const updatedDoctor = { ...doctorData, id: userId, role: "Doctor", status: "Active", isAvailable: true, leaveDate: "", removalReason: "", removedAt: "" };
      if (doctorIndex !== -1) { /* * Reactivate existing * doctor profile. */ state.doctors[doctorIndex] = updatedDoctor; } 
      else { /* * If the old doctor * profile does not exist, * create it. */ state.doctors.push( updatedDoctor ); } 
      localStorage.setItem( "doctors", JSON.stringify( state.doctors ) ); },



    },
});

export const {removeDoctor,reactivateDoctor,updateDoctorProfile,userRegister,userLogin, userLogout,updaterole,updateStatus,addDoctor,addAppointment, updateAppointmentStatus, removeAppointment,} = userSlice.actions;

export default userSlice.reducer;

