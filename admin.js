//var serverURL = "http://restclass.azurewebsites.net/API/";
var serverURL = "http://localhost:8080/api/";

//object constructor
function Item(code, description, price, category, image, stock, deliveryDays) {
    this.code = code;
    this.description = description;
    this.price = price;
    this.category = category;
    this.image = image;
    this.stock = stock;
    this.deliveryDays = deliveryDays;
    this.user = "Kullen";
}


function saveItem() {
    //get the values
    var code = $("#txtcode").val();
    var description = $("#txtdescription").val();
    var price = $("#txtprice").val();
    var category = $("#txtcategory").val();
    var image = $("#txtimage").val();
    var stock = $("#txtstock").val();
    var deliveryDays = $("#txtdeliveryDays").val();

    var jsonString = JSON.stringify(theItem);
    //console.log(jsonString);
    //console.log(theItem);
    //console.log("code:" + code + "description:" + description + "price:" + price + "category:" + category + "image:" + image + "stock:" + stock + "deliveryDays:" + deliveryDays);

    //clear input field
    $("#code").val("");
    $("#description").val("");
    $("#price").val("");
    $("#category").val("");
    $("#image").val("");
    $("#stock").val("");
    $("#deliveryDays").val("");

    //set focus
    $("#code").focus();

    // send to the server
    $.ajax({
        url: serverURL + "items",
        type: "POST",
        data: jsonString,
        contentType: "application/json",
        success: function (response) {
            console.log("ITS WORKING!:" + response);
            clearForm();
            $("#alertSuccess").removeClass("hidden");
            setTimeout(function () {
                $("#alertSuccess").addClass("hidden");
            }, 3000);
        },
        error: function (errorDetails) {
            console.log("Error: " + errorDetails);
        }

    });
}


function testAjax() {
    $.ajax({
        url: serverURL + "test",
        type: 'GET',
        success: function (res) {
            console.log("Server says:"+res);
        }, 
        error: function (err) { 
            console.log("error has occured:"+err); }
    });

    console.log("below ajax req");
    console.log("Waiting on Jax");
}
function init() {
    //hook events
    $("#btnSave").click(saveItem);
}

//when browser finishes loading all elements
window.onload = init;
