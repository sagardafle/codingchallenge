$(function () {

    $('ul > li').hide(); //hide the option list on page load
    $('#optiondisplay').hide();
    /**
     * set and get the value of the from-date selected
     */
    $("#from-datepicker").datepicker({
        format: 'yyyy-mm-dd'
    });
    $("#from-datepicker").on("change", function () {
        var fromdate = $(this).val();
    });

    /**
     * set and get the value of the to-date selected
     */

    $("#to-datepicker").datepicker({
        format: 'yyyy-mm-dd'
    });
    $("#to-datepicker").on("change", function () {
        var fromdate = $(this).val();
    });

    /**
     * from timepicker
     */
    $('#from-timepicker').timepicker({
        'timeFormat': 'H:i:s',    //enable 24 hour clock
        minTime: new Date(0, 0, 0, 00, 00, 00),
        maxTime: new Date(0, 0, 0, 23, 59, 00),
    });


    /**
     * to timepicker
     */
    $('#to-timepicker').timepicker({
        'timeFormat': 'H:i:s',
        minTime: new Date(0, 0, 0, 00, 00, 00),
        maxTime: new Date(0, 0, 0, 23, 59, 00),
    });

    // trigger function to see if any of the input fields were changed
    var fromdatechangefunc = function () {
        $("#from-datepicker").change(function () {
            if ($(this).val() != "") {
                areFieldsSet()
            }
        });
    };
    var todatechangefunc = function () {
        $("#to-datepicker").change(function () {
            if ($(this).val() != "") {
                areFieldsSet()
            }
        });
    };


    var fromtimechangefunc = function () {
        $("#from-timepicker").change(function () {
            if ($(this).val() != "") {
                areFieldsSet()
            }
        });
    };

    var totimechangefunc = function () {
        $("#to-timepicker").change(function () {
            if ($(this).val() != "") {
                areFieldsSet()
            }
        });
    };


    var checkindividualfields = function () {
        fromdatechangefunc();
        fromtimechangefunc();
        todatechangefunc();
        totimechangefunc();
    };

    /*
     check if all the input felds have value(are set)
     */
    var areFieldsSet = function () {

        /*
         get the values of the date and time fields
         */

        if (($('#from-datepicker').val() !== "" && $('#to-datepicker').val() !== "" && $('#from-timepicker').val() !== "" && $('#to-timepicker').val() !== "") || (document.location.search.length > 0)) {

            var url = document.location;
            console.log("appending from fieldset function ");
            /*
             build query parameters
             */
            var from_url = $('#from-datepicker').val() + "T" + $('#from-timepicker').val();
            var to_url = $('#to-datepicker').val() + "T" + $('#to-timepicker').val();
            url += '?from=' + from_url + "&to=" + to_url;
            /*
             history.pushState adds query parameters without reloading the page
             */
            if (history.pushState) {
                var newurl = window.location.protocol + "?from=" + from_url + "&to=" + to_url;
                window.history.pushState({path: newurl}, '', newurl);
            }
            calculatetimeInterval(from_url, to_url);
        }
    };

    /*
     calculates the time interval between the selected date-time range
     */
    var calculatetimeInterval = function (from_url, to_url, url) {
        console.log("F URL " + from_url);
        console.log("T URL " + to_url);
        var a = moment(from_url);
        a.format('DD/MM/YYYY hh:mm:ss');
        var b = moment(to_url);
        b.format('DD/MM/YYYY hh:mm:ss');
        var days = b.diff(a, 'days');
        var hours = b.diff(a, 'hours');
        var minutes = b.diff(a, 'minutes') % 60;
        if (hours >= 24) hours = hours % 24;
        var timeintervalmsg = "Time interval: " + days + " days " + hours + " hours " + minutes + " minutes";
        console.log(timeintervalmsg);
        if (days >= 0) {
            $('#time-interval').show();
        }
        $('input[name="int"]').attr('value', timeintervalmsg);
        displayoptions(days, hours, minutes);
    };

    /*
     Display appropriate options as expected based on time interval
     */
    var displayoptions = function (days, hours, minutes) {
        console.log("calling switch");
        console.log("days" + days);
        switch (true) {

            case days < 0 :
                $('#option-1').hide();
                $('#option-2').hide();
                $('#option-3').hide();
                $('#option-4').hide();
                $('#option-5').hide();
                $('#option-error').show();
                break;

            case (days >= 0 && days < 7):
                $('#optiondisplay').show();
                $('#option-error').hide();
                $('#option-1').show();
                $('#option-2').show();
                $('#option-3').show();
                $('#option-4').show();
                $('#option-5').show();
                break;

            case days >= 7 && days < 31:
                $('#optiondisplay').show();
                $('#option-error').hide();
                $('#option-1').hide();
                $('#option-2').show();
                $('#option-3').show();
                $('#option-4').show();
                $('#option-5').show();
                break;

            case days >= 31 && days < 366:
                $('#optiondisplay').show();
                $('#option-error').hide();
                $('#option-1').hide();
                $('#option-2').hide();
                $('#option-3').show();
                $('#option-4').show();
                $('#option-5').show();
                break;

            case days >= 366:
                $('#optiondisplay').show();
                $('#option-error').hide();
                $('#option-1').hide();
                $('#option-2').hide();
                $('#option-3').hide();
                $('#option-4').show();
                $('#option-5').show();
                break;

            default:
                $('#optiondisplay').hide();
                //  $('#option-list').hide();
                $('#option-error').hide();
        }

        checkindividualfields();  //check if the input fields were changed from UI.
    };

    /*
     Set the values from the query parameters to the UI to reflect the changes and display options accordingly.
     */
    var setValuesFromQueryParams = function (url_from_date, url_from_time, url_to_date, url_to_time) {
        console.log("DATE   " + new Date(url_from_date).getTime());
        var from_timezone = new Date(new Date(url_from_date).getTime() + 7 * 3600 * 1000);
        $('#from-datepicker').datepicker("setDate", from_timezone);

        var to_timezone = new Date(new Date(url_to_date).getTime() + 7 * 3600 * 1000);
        $('#to-datepicker').datepicker("setDate", to_timezone);

        $('#from-timepicker').timepicker('setTime', url_from_time);
        console.log("appppending");
        $('#to-timepicker').timepicker('setTime', url_to_time);
        var from_url = url_from_date + "T" + url_from_time.toString();
        var to_url = url_to_date + "T" + url_to_time.toString();
        calculatetimeInterval(from_url, to_url);
    };


    var checkvalidity = function (user_input) {
        if (user_input.match(/[a-z]/i)) {
            alert("Invalid input! No alphabets allowed");
            return false;
        } else {
            return true;
        }
    };
    /*
     Get the values set by the user for individual fields from the query parameter.
     */

    var getValuesFromQueryParams = function (query_params) {

        var url_from_date = query_params.toString().substring(6, 16);
        console.log("url_from_date " + url_from_date);
        checkvalidity(url_from_date);


        var url_from_time = query_params.toString().substring(17, 25);
        console.log("url_from_time " + url_from_time);
        checkvalidity(url_from_time);


        var url_to_date = query_params.toString().substring(29, 39);
        console.log("url_to_date " + url_to_date);
        checkvalidity(url_to_date);


        var url_to_time = query_params.toString().substring(40, 48);
        console.log("url_to_time " + url_to_time);
        checkvalidity(url_to_time);
        setValuesFromQueryParams(url_from_date, url_from_time, url_to_date, url_to_time)
    };


    /*
     On page load, check if the the query parameters are originally present.
     */

    if (window.location.search.length > 1) {
        console.log(window.location.search);   //query parameters are present
        var query_params = window.location.search;  //fetch the value of query paramters
        getValuesFromQueryParams(query_params);  //get theindividual value of input fields
    } else {
        checkindividualfields();   //check if the input fields were changed from UI.
    }

});