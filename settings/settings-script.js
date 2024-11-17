//maybe want session storage not local storage
function storeInput() {
    const newUsername = document.getElementById("username-input").value;
    const newEmail = document.getElementById("email-input").value;
    const newPassword = document.getElementById("password-input").value;

    const account_information = {
        user: newUsername,
        email: newEmail,
        pass: newPassword
    };

    localStorage.setItem("accountInformation", JSON.stringify(account_information));
    console.log("Account Information stored in localStorage.");
}

// Retrieve the stored account information from localStorage
const storedAccountInfo = JSON.parse(localStorage.getItem("accountInformation"));

// Check if the information exists i think
if (storedAccountInfo) {
    const storedUsername = storedAccountInfo.user;
    const storedEmail = storedAccountInfo.email;
    const storedPassword = storedAccountInfo.pass;

    
    console.log("Retrieved Stored Username:", storedUsername);
    console.log("Retrieved Stored Email:", storedEmail);
    console.log("Retrieved Stored Password:", storedPassword);
} else {
    console.log("No account information found in localStorage.");
}