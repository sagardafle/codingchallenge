$(function () {

    $('ul > li').hide(); //hide the option list on page load
    $('#optiondisplay').hide();

    /**
     * set and get the value of the from-date selected
     */
    $("#from-datepicker").datepicker({
        format: 'yyyy-mm-dd'
    }).on('changeDate', function (e) {
        $(this).datepicker('hide');
    });

    $("#from-datepicker").on("change", function () {
        var fromdate = $(this).val();
    });

    /**
     * set and get the value of the to-date selected
     */

    $("#to-datepicker").datepicker({
        format: 'yyyy-mm-dd'
    }).on('changeDate', function (e) {
        $(this).datepicker('hide');
    });

    $("#to-datepicker").on("change", function () {
        var fromdate = $(this).val();
    });

    /**
     * initialize from-timepicker
     */
    $('#from-timepicker').timepicker({
        'timeFormat': 'H:i:s',    //enable 24 hour clock
        minTime: new Date(0, 0, 0, 00, 00, 0),
        maxTime: new Date(0, 0, 0, 23, 59, 00)
    });


    /**
     * intialize to-timepicker
     */
    $('#to-timepicker').timepicker({
        'timeFormat': 'H:i:s',
        minTime: new Date(0, 0, 0, 00, 00, 00),
        maxTime: new Date(0, 0, 0, 23, 59, 00)
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
                //history.replaceState(null,null, window.location.pathname + "?from=" + from_url + "&to=" + to_url);
            }
            calculatetimeInterval(from_url, to_url);
        }
    };


    /**
     * calculates the time interval between the selected date-time range
     * @param {URL} from_url
     * @param {URL} to_url
     */
    var calculatetimeInterval = function (from_url, to_url, url) {
        var a = moment(from_url);
        a.format('DD/MM/YYYY hh:mm:ss');
        var b = moment(to_url);
        b.format('DD/MM/YYYY hh:mm:ss');
        var days = b.diff(a, 'days');
        var hours = b.diff(a, 'hours');
        var minutes = b.diff(a, 'minutes') % 60;
        if (hours >= 24) hours = hours % 24;
        var timeintervalmsg = "Time interval: " + days + " days " + hours + " hours " + minutes + " minutes";
        if (days >= 0) {
            $('#time-interval').show();
        }
        $('input[name="int"]').attr('value', timeintervalmsg);
        displayoptions(days, hours, minutes);
    };

    /*
     Display appropriate options as expected based on time interval
     * @param {Number} days
     * @param {Number} hours
     * @param {Number} minutes
     */
    var displayoptions = function (days, hours, minutes) {
        switch (true) {

            case days <= 0 && (hours < 0 || minutes < 0):
                $('#option-list,#time-interval').hide();
                $('#optiondisplay , #option-1, #option-2, #option-3, #option-4, #option-5').hide();
                $('#option-error , #option-list').show();
                break;

            case (days >= 0 && days < 7):
                $('#option-error').hide();
                $('#optiondisplay , #option-1, #option-2, #option-3, #option-4, #option-5').show();
                break;

            case days >= 7 && days < 31:
                $('#option-error, #option-1').hide();
                $('#optiondisplay , #option-2, #option-3, #option-4, #option-5').show();
                break;

            case days >= 31 && days < 366:
                $('#optiondisplay,#option-3,#option-4,#option-5').show();
                $('#option-error,#option-1,#option-2').hide();
                break;

            case days >= 366:
                $('#optiondisplay,#option-4,#option-5').show();
                $('#option-error,#option-1,#option-2,#option-3').hide();
                break;

            default:
                $('#optiondisplay,#option-error,#option-1,#option-2,#option-3,#option-4,#option-5').hide();
                break;
        }
        checkindividualfields();  //check if the input fields were changed from UI.
    };

    /*
     Set the values from the query parameters to the UI to reflect the changes and display options accordingly.
     @param {String} url_from_date
     @param {String} url_from_time
     @param {String} url_to_date
     @param {String} url_to_time
     */
    var setValuesFromQueryParams = function (url_from_date, url_from_time, url_to_date, url_to_time) {
        var from_timezone = new Date(new Date(url_from_date).getTime() + 7 * 3600 * 1000);
        $('#from-datepicker').datepicker("setDate", from_timezone);

        var to_timezone = new Date(new Date(url_to_date).getTime() + 7 * 3600 * 1000);
        $('#to-datepicker').datepicker("setDate", to_timezone);

        $('#from-timepicker').timepicker('setTime', url_from_time);
        $('#to-timepicker').timepicker('setTime', url_to_time);
        var from_url = url_from_date + "T" + url_from_time.toString();
        var to_url = url_to_date + "T" + url_to_time.toString();
        calculatetimeInterval(from_url, to_url);
    };

    /**
     * Function to check if the user inputs are valid
     * @param {String} user_input
     * @return {boolean} true/false
     */

    var checkvalidity = function (user_input) {
        if (user_input.match(/[a-z]/i)) {
            alert("Invalid input! No alphabets allowed . Please re-enter correct values and refresh the page");
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
        checkvalidity(url_from_date);


        var url_from_time = query_params.toString().substring(17, 25);
        checkvalidity(url_from_time);


        var url_to_date = query_params.toString().substring(29, 39);
        checkvalidity(url_to_date);


        var url_to_time = query_params.toString().substring(40, 48);
        checkvalidity(url_to_time);
        setValuesFromQueryParams(url_from_date, url_from_time, url_to_date, url_to_time)
    };


    /*
     On page load, check if the the query parameters are originally present.
     If yes, process them accordingly and display options/error(as per the scenario).
     */

    if (window.location.search.length > 1) {
        //query parameters are present
        var query_params = window.location.search;  //fetch the value of query parameters
        getValuesFromQueryParams(query_params);  //get the individual value of input fields
    } else {
        checkindividualfields();   //check if the input fields were changed from UI.
    }
});