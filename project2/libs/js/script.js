$(document).ready(function() {
    ///----------------retrieve data on startup----------------------///
    getPersonnelData();
});
///----------------------Event listeners---------------------------///
///-------issue recursive addition of items on add button
///----------------------Navigation Tabs---------------------------///
$("#personnelBtn").click(function() {
    $("#filterBtn").removeClass("btn-success");
    getPersonnelData();
    $("#personnel-tab-pane").tab("show");
    $("#filterBtn").prop("disabled", false); // Enable the filter button
});

$("#departmentsBtn").click(function() {
    $("#filterBtn").removeClass("btn-success");
    getDepartmentsData();
    $("#departments-tab-pane").tab("show");
    $("#filterBtn").prop("disabled", true); // Disable the filter button
});

$("#locationsBtn").click(function() {
    $("#filterBtn").removeClass("btn-success");
    getLocationsData();
    $("#locations-tab-pane").tab("show");
    $("#filterBtn").prop("disabled", true); // Enable the filter button
});

///-------------------------refresh button----------------------------------///
$("#refreshBtn").click(function() {
    $("#filterBtn").removeClass("btn-success");
    if ($("#personnelBtn").hasClass("active")) {
        getPersonnelData();
    } else if ($("#departmentsBtn").hasClass("active")) {
        {
            getDepartmentsData();
        }
    } else if ($("#locationsBtn").hasClass("active")) {
        getLocationsData();
    }
});

///------------------------Add new button-----------------------------------///
$("#addBtn").click(function() {
    $("#filterBtn").removeClass("btn-success");
    if ($("#personnelBtn").hasClass("active")) {
        $("#insertPersonnelModal")
            .on("show.bs.modal", function() {
                $.ajax({
                    url: "http://localhost/companydirectory/libs/php/getAllDepartments.php",
                    type: "POST",
                    dataType: "json",
                    success: function(result) {
                        var resultCode = result.status.code;
                        if (resultCode == 200) {
                            $("#insertPersonnelDepartment").html("");
                            $.each(result.data, function() {
                                $("#insertPersonnelDepartment").append(
                                    $("<option>", {
                                        value: this.id,
                                        text: this.name,
                                    })
                                );
                            });
                            $("#insertPersonnelDepartment").val(result.data[0].id);
                        } else {
                            $("#insertPersonnelModal .modal-title").replaceWith(
                                "Error retrieving data"
                            );
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        $("#insertPersonnelModal .modal-title").replaceWith(
                            "Error retrieving data"
                        );
                    },
                });
            })
            .modal("show");
    } else if ($("#departmentsBtn").hasClass("active")) {
        $("#insertDepartmentModal")
            .on("show.bs.modal", function() {
                $.ajax({
                    url: "http://localhost/companydirectory/libs/php/getAllLocations.php",
                    type: "POST",
                    dataType: "json",
                    success: function(result) {
                        var resultCode = result.status.code;
                        if (resultCode == 200) {
                            $("#insertDepartmentLocation").html("");
                            $.each(result.data, function() {
                                $("#insertDepartmentLocation").append(
                                    $("<option>", {
                                        value: this.id,
                                        text: this.name,
                                    })
                                );
                            });
                            $("#insertDepartmentLocation").val(result.data[0].id);
                        } else {
                            $("#insertDepartmentModal .modal-title").replaceWith(
                                "Error retrieving data"
                            );
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        $("#insertDepartmentModal .modal-title").replaceWith(
                            "Error retrieving data"
                        );
                    },
                });
            })
            .modal("show");
    } else if ($("#locationsBtn").hasClass("active")) {
        $("#insertLocationModal").modal("show");
    }
});
///------------------Insert personnel form-------------------------///
$("#insertPersonnelForm").on("submit", function(e) {
    e.preventDefault();

    const firstName = $("#insertPersonnelFirstName").val();
    const lastName = $("#insertPersonnelLastName").val();
    const jobTitle = $("#insertPersonnelJobTitle").val();
    const email = $("#insertPersonnelEmailAddress").val();
    const departmentID = $("#insertPersonnelDepartment").val();
    $.ajax({
        url: "http://localhost/companydirectory/libs/php/insertPersonnel.php",
        type: "POST",
        dataType: "json",
        data: {
            firstName: firstName,
            lastName: lastName,
            jobTitle: jobTitle,
            email: email,
            departmentID: departmentID,
        },
        success: function(result) {
            var resultCode = result.status.code;

            if (resultCode == 200) {
                getPersonnelData();

                $("#personnelSuccess").text(` ${lastName}, ${firstName}`);
                $("#addPersonnelSuccessModal").modal("show");
            } else {
                alert("Data edit failed, please try again");
            }
            $("#insertPersonnelModal").modal("hide");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Data edit failed, please try again");
        },
    });
});
///------------------insert department form------------------------///
$("#insertDepartmentForm").on("submit", function(e) {
    e.preventDefault();
    const locationID = $("#insertDepartmentLocation").val();
    const name = $("#insertDepartmentName").val();

    $.ajax({
        url: "http://localhost/companydirectory/libs/php/insertDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
            locationID: locationID,
            name: name,
        },
        success: function(result) {
            var resultCode = result.status.code;

            if (resultCode == 200) {
                getDepartmentsData();
                $("#departmentSuccess").text(` ${name}`);
                $("#addDepartmentSuccessModal").modal("show");
            } else {
                alert("Data edit failed, please try again");
            }
            $("#insertDepartmentModal").modal("hide");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Data edit failed, please try again");
        },
    });
});
///------------------------Insert location form----------------------------///
$("#insertLocationForm").on("submit", function(e) {
    e.preventDefault();
    const name = $("#insertLocationName").val();
    $.ajax({
        url: "http://localhost/companydirectory/libs/php/insertLocation.php",
        type: "POST",
        dataType: "json",
        data: {
            name: name,
        },
        success: function(result) {
            var resultCode = result.status.code;

            if (resultCode == 200) {
                getLocationsData();
                $("#locationSuccess").text(` ${name}`);
                $("#addLocationSuccessModal").modal("show");
            } else {
                alert("Data edit failed, please try again");
            }
            $("#insertLocationModal").modal("hide");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Data edit failed, please try again");
        },
    });
});
///------------------------Search button-----------------------------------///

$("#searchInp").on("keyup", function() {
    var value = this.value.toLowerCase().trim();

    $("table tr").each(function() {
        var found = false; // Flag to track if the value is found in any of the columns

        $(this)
            .find("td")
            .each(function() {
                var cellText = $(this).text().toLowerCase().trim();

                if (cellText.indexOf(value) !== -1) {
                    found = true; // Value is found in this column
                    return false; // Exit the loop since we found a match
                }
            });

        // Toggle row visibility based on whether the value was found
        $(this).toggle(found);
    });
});

///------------------------Filter button-----------------------------------///

$("#filterBtn").click(function() {
    $("#filterPersonnelModal")
        .on("show.bs.modal", function() {
            $.ajax({
                url: "http://localhost/companydirectory/libs/php/getAll.php",
                type: "POST",
                dataType: "json",
                success: function(result) {
                    var resultCode = result.status.code;
                    if (resultCode == 200) {
                        const data = result.data;
                        const departments = new Set();
                        const locations = new Set();

                        data.forEach((item) => {
                            departments.add(item.department);
                            locations.add(item.location);
                        });

                        const sortedDepartments = [...departments].sort();
                        const sortedLocations = [...locations].sort();
                        $("#filterPersonnelDepartment").html("");

                        sortedDepartments.forEach(function(department) {
                            $("#filterPersonnelDepartment").append(
                                $("<option>", {
                                    value: department,
                                    text: department,
                                })
                            );
                        });

                        sortedLocations.forEach(function(location) {
                            $("#filterPersonnelLocation").append(
                                $("<option>", {
                                    value: location,
                                    text: location,
                                })
                            );
                        });
                    } else {
                        $("#filterPersonnelModal .modal-title").replaceWith(
                            "Error retrieving data"
                        );
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#filterPersonnelModal .modal-title").replaceWith(
                        "Error retrieving data"
                    );
                },
            });
        })
        .modal("show");
});

//--form
$("#filterByDepartmentForm").on("submit", function(e) {
    e.preventDefault();

    const department = $("#filterPersonnelDepartment").val();

    $.ajax({
        url: "http://localhost/companydirectory/libs/php/filterPersonnelByDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
            department: department,
        },
        success: function(result) {
            var resultCode = result.status.code;
            const data = result.data;

            if (resultCode == 200) {
                $("#filterBtn").addClass("btn-success");
                $("#data-table-personnel").empty();
                $("#data-table-locations").empty();
                $("#data-table-departments").empty();

                let table1 = document.getElementById("data-table-personnel");
                generatePersonnelTable(table1, data);
                let table2 = document.getElementById("data-table-departments");
                generatePersonnelTable(table2, data);
                let table3 = document.getElementById("data-table-departments");
                generatePersonnelTable(table3, data);
            } else {
                alert("Search query failed, please try again");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Search query failed, please try again");
        },
    });

    $("#filterPersonnelModal").modal("hide");
});

//---filter by location form
$("#filterByLocationForm").on("submit", function(e) {
    e.preventDefault();
    const location = $("#filterPersonnelLocation").val();

    $.ajax({
        url: "http://localhost/companydirectory/libs/php/filterPersonnelByLocation.php",
        type: "POST",
        dataType: "json",
        data: {
            location: location,
        },
        success: function(result) {
            var resultCode = result.status.code;
            const data = result.data;

            if (resultCode == 200) {
                $("#filterBtn").addClass("btn-success");
                $("#data-table-personnel").empty();
                $("#data-table-locations").empty();
                $("#data-table-departments").empty();

                let table1 = document.getElementById("data-table-personnel");
                generatePersonnelTable(table1, data);
                let table2 = document.getElementById("data-table-departments");
                generatePersonnelTable(table2, data);
                let table3 = document.getElementById("data-table-departments");
                generatePersonnelTable(table3, data);
            } else {
                alert("Search query failed, please try again");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Search query failed, please try again");
        },
    });
    $("#filterPersonnelModal").modal("hide");
});

///------------------------Delete Personnel----------------------------------///

$("#deletePersonnelModal").on("show.bs.modal", function(e) {
    $.ajax({
        url: "http://localhost/companydirectory/libs/php/getPersonnelByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $(e.relatedTarget).attr("data-id"),
        },
        success: function(result) {
            var resultCode = result.status.code;

            if (resultCode == 200 && result.data.personnel && result.data.personnel.length > 0)  {
                $("#deletePersonnelEmployeeID").val(result.data.personnel[0].id);

                $("#deletePersonnelFormName").html(
                    `Are you sure you want to delete the  entry ${result.data.personnel[0].lastName}, ${result.data.personnel[0].firstName}?`
                );

                // $("#editPersonnelDepartment").html("");
            } else {
                $("#deletePersonnelModal .modal-title").replaceWith(
                    "Error retrieving data"
                );
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $("#deletePersonnelModal .modal-title").replaceWith(
                "Error retrieving data"
            );
        },
    });
    $("#deletePersonnelModal").modal("hide");
});

///-----------------Form submission

$("#deletePersonnelForm").on("submit", function(e) {
    e.preventDefault();

    const id = $("#deletePersonnelEmployeeID").val();

    $.ajax({
        url: "http://localhost/companydirectory/libs/php/deletePersonnelByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: id,
        },
        success: function(result) {
            var resultCode = result.status.code;

            if (resultCode == 200) {
                $("#filterBtn").removeClass("btn-success");
                $("#data-table-personnel").empty();
                $("#data-table-locations").empty();
                $("#data-table-departments").empty();
                getPersonnelData();

                $("#deletePersonnelSuccessModal").modal("show");
            } else {
                alert("Something went wrong please try again.");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Something went wrong please try again.");
        },
    });
    $("#deletePersonnelModal").modal("hide");
});

///------------------------Delete Department----------------------------------///

$(document).on("click", ".deleteDepartmentBtn", function() {
    let id = $(this).attr("data-id");
    $.ajax({
        url: "http://localhost/companydirectory/libs/php/personnelCount.php",
        type: "POST",
        dataType: "json",
        data: {
            id: id,
        },
        success: function(result) {
            var resultCode = result.status.code;

            if (resultCode == 200) {
                if (result.data[0].departmentCount > 0) {
                    $("#cantDeleteDeptName").text(result.data[0].departmentName);
                    $("#pc").text(result.data[0].departmentCount);
                    $("#cantDeleteDepartmentModal").modal("show");
                } else {
                    $("#deleteDepartmentID").val(id);

                    $("#deleteDepartmentFormName").replaceWith(
                        `Are you sure you want to delete the department ${result.data[0].departmentName}?`
                    );

                    $("#deleteDepartmentModal").modal("show");
                }
            } else {
                $("#deleteDepartmentModal .modal-title").replaceWith(
                    "Error retrieving data"
                );
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $("#deleteDepartmentModal .modal-title").replaceWith(
                "Error retrieving data"
            );
        },
    });
    $("#deleteDepartmentModal").modal("hide");
});

///-----------------Form submission

$("#deleteDepartmentForm").on("submit", function(e) {
    e.preventDefault();

    const id = $("#deleteDepartmentID").val();

    $.ajax({
        url: "http://localhost/companydirectory/libs/php/deleteDepartmentByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: id,
        },
        success: function(result) {
            var resultCode = result.status.code;

            if (resultCode == 200) {
                $("#filterBtn").removeClass("btn-success");
                $("#data-table-personnel").empty();
                $("#data-table-locations").empty();
                $("#data-table-departments").empty();
                getDepartmentsData();
                $("#deleteDepartmentSuccessModal").modal("show");
            } else {
                alert("Something went wrong please try again.");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Something went wrong please try again.");
        },
    });

    $("#deleteDepartmentModal").modal("hide");
});
///------------------------Delete Location----------------------------------///

$(document).on("click", ".deleteLocationBtn", function() {
    let id = $(this).attr("data-id");

    $.ajax({
        url: "http://localhost/companydirectory/libs/php/departmentCount.php",
        type: "POST",
        dataType: "json",
        data: {
            id: id,
        },
        success: function(result) {
            var resultCode = result.status.code;

            if (resultCode == 200) {
                if (result.data[0].locationCount > 0) {
                    $("#cantDeletelocationName").text(result.data[0].locationName);
                    $("#dc").text(result.data[0].locationCount);
                    $("#cantDeleteLocationModal").modal("show");
                } else {
                    $("#deleteLocationID").val(id);

                    $("#deleteLocationFormName").replaceWith(
                        `Are you sure you want to delete the location ${result.data[0].locationName}?`
                    );

                    $("#deleteLocationModal").modal("show");
                }
            } else {
                $("#deleteLocationModal .modal-title").replaceWith(
                    "Error retrieving data"
                );
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error(errorThrown);
            $("#deleteLocationModal .modal-title").replaceWith(
                "Error retrieving data"
            );
        },
    });
});

///-----------------Form submission

$("#deleteLocationForm").on("submit", function(e) {
    e.preventDefault();

    const id = $("#deleteLocationID").val();

    $.ajax({
        url: "http://localhost/companydirectory/libs/php/deleteLocationByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: id,
        },
        success: function(result) {
            var resultCode = result.status.code;

            if (resultCode == 200) {
                $("#filterBtn").removeClass("btn-success");
                $("#data-table-personnel").empty();
                $("#data-table-locations").empty();
                $("#data-table-departments").empty();
                getLocationsData();
                $("#deleteLocationSuccessModal").modal("show");
            } else {
                alert("Something went wrong please try again.");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Something went wrong please try again.");
        },
    });
    $("#deleteLocationModal").modal("hide");
});

///------------------------------Edit personnel------------------------------///

$("#editPersonnelModal").on("show.bs.modal", function(e) {
    $.ajax({
        url: "http://localhost/companydirectory/libs/php/getPersonnelByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $(e.relatedTarget).attr("data-id"),
        },
        success: function(result) {
            var resultCode = result.status.code;

            if (resultCode == 200) {
                $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);

                $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
                $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
                $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
                $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);

                $("#editPersonnelDepartment").html("");

                $.each(result.data.department, function() {
                    $("#editPersonnelDepartment").append(
                        $("<option>", {
                            value: this.id,
                            text: this.name,
                        })
                    );
                });

                $("#editPersonnelDepartment").val(
                    result.data.personnel[0].departmentID
                );
            } else {
                $("#editPersonnelModal .modal-title").replaceWith(
                    "Error retrieving data"
                );
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $("#editPersonnelModal .modal-title").replaceWith(
                "Error retrieving data"
            );
        },
    });
});

$("#editPersonnelForm").on("submit", function(e) {
    e.preventDefault();
    const id = $("#editPersonnelEmployeeID").val();
    const firstName = $("#editPersonnelFirstName").val();
    const lastName = $("#editPersonnelLastName").val();
    const jobTitle = $("#editPersonnelJobTitle").val();
    const email = $("#editPersonnelEmailAddress").val();
    const departmentID = $("#editPersonnelDepartment").val();
    $.ajax({
        url: "http://localhost/companydirectory/libs/php/editPersonnel.php",
        type: "POST",
        dataType: "json",
        data: {
            id: id,
            firstName: firstName,
            lastName: lastName,
            jobTitle: jobTitle,
            email: email,
            departmentID: departmentID,
        },
        success: function(result) {
            var resultCode = result.status.code;

            if (resultCode == 200) {
                $("#filterBtn").removeClass("btn-success");
                $("#editPersonnelSuccess").text(`${lastName}, ${firstName}`);
                $("#editPersonnelSuccessModal").modal("show");
                $("#data-table-personnel").empty();
                $("#data-table-locations").empty();
                $("#data-table-departments").empty();
                getPersonnelData();
            } else {
                alert("Data edit failed, please try again");
            }
            $("#editPersonnelModal").modal("hide");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Data edit failed, please try again");
        },
    });
});

///----------------------Edit department data---------------------///
$("#editDepartmentModal").on("show.bs.modal", function(e) {
    $.ajax({
        url: "http://localhost/companydirectory/libs/php/getDepartmentByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $(e.relatedTarget).attr("data-id"),
        },
        success: function(result) {
            var resultCode = result.status.code;

            if (resultCode == 200) {
                $("#editDepartmentID").val(result.data[0].id);
                $("#editDepartmentName").val(result.data[0].name);
            } else {
                $("#editDepartmentModal .modal-title").replaceWith(
                    "Error retrieving data"
                );
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $("#editDepartmentModal .modal-title").replaceWith(
                "Error retrieving data"
            );
        },
    });
});

$("#editDepartmentForm").on("submit", function(e) {
    e.preventDefault();
    const id = $("#editDepartmentID").val();
    const name = $("#editDepartmentName").val();
    $.ajax({
        url: "http://localhost/companydirectory/libs/php/editDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
            id: id,
            name: name,
        },
        success: function(result) {
            var resultCode = result.status.code;

            if (resultCode == 200) {
                $("#filterBtn").removeClass("btn-success");
                $("#data-table-personnel").empty();
                $("#data-table-locations").empty();
                $("#data-table-departments").empty();
                getDepartmentsData();
                $("#editDepartmentSuccess").text(`${name}`);
                $("#editDepartmentSuccessModal").modal("show");
            } else {
                alert("Data edit failed, please try again");
            }
            $("#editDepartmentModal").modal("hide");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Data edit failed, please try again");
        },
    });
});
///----------------------Edit location data-----------------------///
$("#editLocationModal").on("show.bs.modal", function(e) {
    $.ajax({
        url: "http://localhost/companydirectory/libs/php/getLocationByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $(e.relatedTarget).attr("data-id"),
        },
        success: function(result) {
            var resultCode = result.status.code;

            if (resultCode == 200) {
                $("#editLocationID").val(result.data[0].id);
                $("#editLocationName").val(result.data[0].name);
            } else {
                $("#editLocationModal .modal-title").replaceWith(
                    "Error retrieving data"
                );
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $("#editLocationModal .modal-title").replaceWith("Error retrieving data");
        },
    });
});

$("#editLocationForm").on("submit", function(e) {
    e.preventDefault();
    const id = $("#editLocationID").val();
    const name = $("#editLocationName").val();
    $.ajax({
        url: "http://localhost/companydirectory/libs/php/editLocation.php",
        type: "POST",
        dataType: "json",
        data: {
            id: id,
            name: name,
        },
        success: function(result) {
            var resultCode = result.status.code;

            if (resultCode == 200) {
                $("#filterBtn").removeClass("btn-success");
                $("#data-table-personnel").empty();
                $("#data-table-locations").empty();
                $("#data-table-departments").empty();
                getLocationsData();
                $("#editLocationSuccess").text(`${name}`);
                $("#editLocationSuccessModal").modal("show");
            } else {
                alert("Data edit failed, please try again");
            }
            $("#editLocationModal").modal("hide");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Data edit failed, please try again");
        },
    });
});
///----------------------Functions--------------------------------///

function generatePersonnelTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        let nameCell = row.insertCell();
        let nameText = `${element.lastName}, ${element.firstName}`;
        nameCell.classList = "align-middle text-nowrap";
        nameCell.append(nameText);

        let departmentCell = row.insertCell();
        let departmentText = `${element.department}`;
        departmentCell.classList =
            "align-middle text-nowrap d-none d-md-table-cell";
        departmentCell.append(departmentText);

        let locationCell = row.insertCell();
        let locationText = `${element.location}`;
        locationCell.classList = "align-middle text-nowrap d-none d-md-table-cell";
        locationCell.append(locationText);

        let emailCell = row.insertCell();
        let emailtext = `${element.email}`;
        emailCell.classList = "align-middle text-nowrap d-none d-md-table-cell";
        emailCell.append(emailtext);

        let ButtonCell = row.insertCell();
        ButtonCell.classList = "align-middle text-end text-nowrap";
        let editButton = document.createElement("button");
        editButton.type = "button";
        editButton.classList = "btn btn-primary btn-sm me-1";
        editButton.setAttribute("data-bs-target", "#editPersonnelModal");
        editButton.setAttribute("data-bs-toggle", "modal");
        editButton.setAttribute("data-id", `${element.id}`);
        let editButtonImage = document.createElement("i");
        editButtonImage.classList = "fa-solid fa-pencil fa-fw";
        editButton.append(editButtonImage);

        let deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList = "btn btn-primary btn-sm";
        deleteButton.setAttribute("data-bs-target", "#deletePersonnelModal");
        deleteButton.setAttribute("data-bs-toggle", "modal");
        deleteButton.setAttribute("data-id", `${element.id}`);
        let deleteButtonImage = document.createElement("i");
        deleteButtonImage.classList = "fa-solid fa-trash fa-fw";
        deleteButton.append(deleteButtonImage);
        ButtonCell.append(editButton, deleteButton);
    }
}

///----------------------Get personnel data-----------------------///

function getPersonnelData() {
    $.ajax({
        url: "http://localhost/companydirectory/libs/php/getAll.php",
        type: "POST",
        dataType: "json",

        success: function(result) {
            const data = result.data;

            var resultCode = result.status.code;

            ///------------------------Populate personnel table------------------------///

            if (resultCode == 200) {
                $("#data-table-personnel").empty();
                let table = document.getElementById("data-table-personnel");
                generatePersonnelTable(table, data);
            } else {
                ///------------------------Error personnel table------------------------///
                let personnelTable = `<tr>
            <td class="align-middle text-nowrap">Error Retrieving Personnel Data</td>
            
          </tr>`;

                $("#data-personnelTable-personnel").append(personnelTable);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            let personnelTable = `<tr>
          <td class="align-middle text-nowrap">Error Retrieving Personnel data</td>
          
        </tr>`;

            $("#data-table-personnel").append(personnelTable);
        },
    });
}
///----------------------Generate departments table-----------------///
function generateDepartmentsTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        let nameCell = row.insertCell();
        let nameText = `${element.name}`;
        nameCell.classList = "align-middle text-nowrap";
        nameCell.append(nameText);

        let locationCell = row.insertCell();
        let locationText = `${element.location}`;
        locationCell.classList = "align-middle text-nowrap d-none d-md-table-cell";
        locationCell.append(locationText);

        ButtonCell = row.insertCell();
        ButtonCell.classList = "text-end text-nowrap";
        let editButton = document.createElement("button");
        editButton.type = "button";
        editButton.classList = "btn btn-primary btn-sm me-1";
        editButton.setAttribute("data-bs-target", "#editDepartmentModal");
        editButton.setAttribute("data-bs-toggle", "modal");
        editButton.setAttribute("data-id", `${element.id}`);
        let editButtonImage = document.createElement("i");
        editButtonImage.classList = "fa-solid fa-pencil fa-fw";
        editButton.append(editButtonImage);

        let deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList = "btn btn-primary btn-sm deleteDepartmentBtn";

        deleteButton.setAttribute("data-id", `${element.id}`);
        let deleteButtonImage = document.createElement("i");
        deleteButtonImage.classList = "fa-solid fa-trash fa-fw";
        deleteButton.append(deleteButtonImage);
        ButtonCell.append(editButton, deleteButton);
    }
}
///----------------------Get departments data-----------------------///
function getDepartmentsData() {
    $.ajax({
        url: "http://localhost/companydirectory/libs/php/getAllDepartments.php",
        type: "POST",
        dataType: "json",

        success: function(result) {
            const data = result.data;

            var resultCode = result.status.code;
            if (resultCode == 200) {
                $("#data-table-departments").empty();
                let table = document.getElementById("data-table-departments");
                generateDepartmentsTable(table, data);
            } else {
                ///------------------------Error Department table------------------------///
                let departmentTable = `<tr>
        <td class="align-middle text-nowrap">  Error Retrieving Deparment Data</td>
       
      </tr>`;

                $("#data-table-departments").append(departmentTable);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            let departmentTable = `<tr>
          <td class="align-middle text-nowrap">  Error Retrieving Department Data</td>
          
        </tr>`;

            $("#data-table-departments").append(departmentTable);
        },
    });
}
///----------------------Generate locations table-----------------///
function generatelocationsTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        let nameCell = row.insertCell();
        let nameText = `${element.name}`;
        nameCell.classList = "align-middle text-nowrap";
        nameCell.append(nameText);

        ButtonCell = row.insertCell();
        ButtonCell.classList = "text-end text-nowrap";
        let editButton = document.createElement("button");
        editButton.type = "button";
        editButton.classList = "btn btn-primary btn-sm me-1";
        editButton.setAttribute("data-bs-target", "#editLocationModal");
        editButton.setAttribute("data-bs-toggle", "modal");
        editButton.setAttribute("data-id", `${element.id}`);
        let editButtonImage = document.createElement("i");
        editButtonImage.classList = "fa-solid fa-pencil fa-fw";
        editButton.append(editButtonImage);

        let deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList = "btn btn-primary btn-sm deleteLocationBtn";
        deleteButton.setAttribute("data-id", `${element.id}`);
        let deleteButtonImage = document.createElement("i");
        deleteButtonImage.classList = "fa-solid fa-trash fa-fw";
        deleteButton.append(deleteButtonImage);
        ButtonCell.append(editButton, deleteButton);
    }
}
///----------------------Get locations data-----------------------///
function getLocationsData() {
    $.ajax({
        url: "http://localhost/companydirectory/libs/php/getAllLocations.php",
        type: "POST",
        dataType: "json",

        success: function(result) {
            const data = result.data;

            var resultCode = result.status.code;
            let locationsTable;

            if (resultCode == 200) {
                $("#data-table-locations").empty();
                let table = document.getElementById("data-table-locations");
                generatelocationsTable(table, data);
            } else {
                ///------------------------Error Location table------------------------///

                const locationsTable = `<tr>
        <td class="align-middle text-nowrap">Error Retrieving Data</td>
        
      </tr>`;
                $("#data-table-locations").append(locationsTable);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error(errorThrown);
            const locationsTable = `<tr>
       
      </tr>`;
            $("#data-table-locations").append(locationsTable);
        },
    });
}