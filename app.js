
//  BUDGET CONTROLLER
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

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            // create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // create new item based on 'exp' or 'inc' type
            if (type === 'exp') {
                new Expense(ID, des, val);
            } else if (type === 'inc') {
                new Income(ID, des, val);
            }

            // push it into our data structure
            data.allItems[type].push(newItem);

            // return the new element
            return newItem;
        },
        testing: function () {
            console.log(data);

        }
    };
})();

// UI CONTROLLER
var UIController = (function () {
    var DOMstrings = {
        inputType: '.add__type',
        addDescription: '.add__description',
        addValue: '.add__value',
        inputBtn: '.add__btn'
    };
    return {
        getInput: function () {
            return {
                // instead of returning variables, return an object
                type: document.querySelector(DOMstrings.inputType).value, // inc/exp
                description: document.querySelector(DOMstrings.addDescription).value,
                value: document.querySelector(DOMstrings.addValue).value
            };

        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();

// GLOBAL APP CONTROLLER
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
    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get field input data
        input = UICtrl.getInput();
        console.log(input);

        // 2. Add item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // 3. Add item to the UI
        // 4. Calculate the budget
        // 5. Display the budget on the UI

    };

    return {
        init: function () {
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();