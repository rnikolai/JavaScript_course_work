/*********************************************************************************
* WEB422 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Nikolai Rubtcov Student ID: 134471168 Date: September 28th 2018
*
*
********************************************************************************/

let employeesModel = [];

$(document).ready(function () {

    function initializeEmployeesModel() {
        $.ajax({
            url: "https://protected-wildwood-80515.herokuapp.com/employees",
            type: "GET",
            contentType: "applicaton/json"
        })
            .done(function (result) {
                employeesModel = result;
                refreshEmployeeRows(employeesModel);
            })
            .fail(function (err) {
                showGenericModal('err', 'Unable to get Employees');
            })
    }


    function showGenericModel(title, message) {
        let $data = $("#genericModal");

        $(".modal-title").empty().append(title);;
        $(".modal-body").empty().append(message);
       
        $data.modal({
            backdrop: 'static',
            keyboard: false
        });

    }

    function refreshEmployeeRows(employees) {
        let template1 = _.template('<%_.forEach(employee,function(employee){ %>' +
            '<div class="row body-row" data-id=<%- employee._id %>>' +
            '<div class="col-xs-4 body-column"><%- employee.FirstName %></div>' +
            '<div class="col-xs-4 body-column"><%- employee.LastName %></div>' +
            '<div class="col-xs-4 body-column"><%- employee.Position.PositionName %></div>' +
            '</div>' +
            '<% }); %>');

        let employeeResult = template1({ 'employee': employees });

        var $data = $("#employees-table");
        $data.empty();//need to empty it every refresh
        $data.append(employeeResult);
    }

    function getFilteredEmployeesModel(filterString) {
        let filter = _.filter(employeesModel, function (employee) {
            return _.includes(employee.FirstName.toLowerCase(), filterString.toLowerCase()) || _.includes(employee.LastName.toLowerCase(), filterString.toLowerCase()) || _.includes(employee.Position.PositionName.toLowerCase(), filterString.toLowerCase());
        })
        return filter;
    }

    function getEmployeeModelById(id) {
        let findById = _.find(employeesModel, function (employee) {
            return employee._id == id;
        });
        if (findById == '') {
            return null;
        }
        else {
            return _.cloneDeep(findById);
        }
    }

    $(function () {
        initializeEmployeesModel();

        $("#employee-search").keyup(function () {
            let filteredArray = getFilteredEmployeesModel($("#employee-search").val());
            refreshEmployeeRows(filteredArray);
        });

        $(document).on("click", ".body-row", function () {
            let id = $(this).attr("data-id");
            let employee = getEmployeeModelById(id);
            let hireDate = moment(employee.HireDate);
            let hireDateUtc = hireDate.utc();
            employee.HireDate = hireDateUtc.format('LL');

            let templateLodash1 = _.template(
                '<strong>Address: </strong><%- employee.AddressStreet %> <%- employee.AddressCity %>, <%-employee.AddressState%> <%-employee.AddressZip%><br>' +
                '<strong>Phone Number: </strong><%-employee.PhoneNum%> ext: </strong><%-employee.Extension%><br>' +
                '<strong>Hire Date: </strong><%-employee.HireDate%>'
            );
            let templateResult = templateLodash1({ 'employee': employee });
            showGenericModel(employee.FirstName + ' ' + employee.LastName, templateResult);
        });
    })
});