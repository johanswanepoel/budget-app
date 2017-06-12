
//////////////////////////////////////////////////////
//  BUDGET CONTROLLER
//////////////////////////////////////////////////////

var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            // create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
                // data.allItems.exp.length.id + 1; 
            } else {
                ID = 0;
            }

            // create new item based on 'exp' or 'inc' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // push it into our data structure
            data.allItems[type].push(newItem);

            // return the new element
            return newItem;
        },
        calculateBudget: function () {

            // calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');

            // calculate budget = inc - exp
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income we spent  
            if (data.totals.inc > data.totals.exp) {
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);                
            } else {
                data.percentage = -1;
            }
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.exp,
                totalExp: data.totals.inc,
                percentage: data.percentage
            };
        },
        testing: function () {
            console.log(data);

        }
    };
})();

//////////////////////////////////////////////////////
//// UI CONTROLLER
//////////////////////////////////////////////////////


var UIController = (function () {
    var DOMstrings = {
        inputType: '.add__type',
        addDescription: '.add__description',
        addValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        inputDescription: '.add__description',
        inputValue: '.add__value'
    };

    return {
        getInput: function () {
            return {
                // instead of returning variables, return an object
                type: document.querySelector(DOMstrings.inputType).value, // inc/exp
                description: document.querySelector(DOMstrings.addDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.addValue).value) // parseFloat converts string to decimal number
            };

        },
        addListItem: function (obj, type) {
            // create html string with placeholder text
            var html, newHtml;

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description" >%description%</div ><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div >';

            }

            // replace placeholder text with data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // insert the HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        clearFields: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields); // will trick slice method to view fields (a list) as an array 
            fieldsArr.forEach(function (current, index, array) { // current element, index of current element, original array
                current.value = '';
            });
            fieldsArr[0].focus();
        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();

//////////////////////////////////////////////////////
//// GLOBAL APP CONTROLLER
//////////////////////////////////////////////////////

var controller = (function (budgetCtrl, UICtrl) {
    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }

        });

    };

    var updateBudget = function () {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        console.log(budget);



    };

    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get field input data
        input = UICtrl.getInput();
        // console.log(input); // to test input values 
        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. Add item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();
        }

    };

    return {
        init: function () {
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();