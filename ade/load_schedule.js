// Every day of the week to display dynamically
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Start and end time for the scheduler, dynamically adjustable
const startTime = 8;
const endTime = 21;

// (to change and maybe change location) Table to align events that start at the same time 
var events_hour_per_day_list = [[], [], [], [], []];

// Version of the app
const version = "1.5";

// Default data to be displayed
var default_data = "S6INF";

// Store the selected data to display the colors
var actual_data = default_data;

// Actual date to determine the current week dynamically
var actual_date = new Date();

// The table to choose for color attribution
var color_data;

// Wait for the content to load before displaying the events
document.addEventListener("DOMContentLoaded", function () {

    // Display a clock
    setInterval(updateClock, 1000, "update");

    // Display what is the actual content
    init_head(default_data);

    // Dynamically generating the table
    // Parent element containing the full table
    const scheduler_box = document.getElementById("event-scheduler");

    // Container for the table
    const scheduler = document.createElement("div");
    scheduler.classList.add("scheduler");
    scheduler_box.appendChild(scheduler);

    // Columns container
    const scheduler_columns = document.createElement("div");
    scheduler_columns.classList.add("scheduler_columns");
    scheduler.appendChild(scheduler_columns);

    // Rows container
    const scheduler_rows = document.createElement("div");
    scheduler_rows.classList.add("scheduler_rows")

    // Options for date formatting
    options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    
    // Storing the previous monday to display the dates of the current week later in the "for" loop
    var text_date = previousMonday();

    // Loop displaying the columns with their correct day names and formatted dates
    for (let day of daysOfWeek) {
        
        // Column element
        const scheduler_column = document.createElement("section");
        scheduler_column.classList.add("scheduler_column");
        
        // Day name element
        const day_name = document.createElement("div");
        day_name.classList.add("day_name");
        
        // Formatted date under the day name
        const date_under = document.createElement("div");
        date_under.classList.add("date_under");

        // Applying
        formatted_date = text_date.toLocaleDateString("fr-fr", options);
        date_under.textContent = formatted_date;
        day_name.textContent = day;
        day_name.appendChild(date_under);

        // The CSS style add a left border but we need a right one for friday
        if (day == "Friday"){
            scheduler_column.style.borderRight = 1 +"px solid";
            scheduler_column.style.borderColor = "rgb(78, 90, 101, 0.3)"; //right AND left
        }

        // Applying
        scheduler_column.setAttribute("id", day)
        scheduler_column.appendChild(day_name);
        scheduler_columns.appendChild(scheduler_column);

        // Going to the next day for the next iteration
        text_date.setDate(text_date.getDate()+1);
    }

    // Creating the rows and adding the time spans for the schedule
    for (i = startTime; i <= endTime; i++){

        // Row elements
        const scheduler_row = document.createElement("div");
        const scheduler_empty_row = document.createElement("div");
        scheduler_row.classList.add("scheduler_row");
        scheduler_empty_row.classList.add("scheduler_row");

        // Hour span element
        const hour_span = document.createElement("span");
        hour_span.classList.add("hour_span");

        // Adding 0 to the hour if it's 1 digit
        if (i < 10) {
            hour_span.textContent = "0" + formatTime(i);
        }

        // Displaying the corresponding hour at the beginning of the row
        else {
            hour_span.textContent = formatTime(i);
        }

        // Applying
        scheduler_row.appendChild(hour_span);
        scheduler_rows.appendChild(scheduler_row);

        // Not adding an empty row at the end
        if (i != endTime){
            scheduler_rows.appendChild(scheduler_empty_row);
        }
    }

    // Applying the rows
    scheduler.appendChild(scheduler_rows);

    // The fetch function to retrieve calendar data in .ics format
    fetchICS("ressources/"+default_data+".ics");

    // Adding a click behaviour to the year selector menu
    change_ressource = document.getElementsByClassName("year");
    for (year of change_ressource){

        // Display the associated data on click
        year.addEventListener("click", function () {

            // Regex to retrieve to correct ressource according to the button text
            const re = /^(\w*)/g;
            const text_clicked = this.textContent;
            const group_found = text_clicked.match(re);

            fetchICS("ressources/"+group_found[0]+".ics");

            // Display what is the actual content
            init_head(group_found[0]);

            // Store what is the actual data
            actual_data = group_found[0];
        });
    }

    // Week change left arrow behaviour
    temp_head = document.getElementById("head_main");
    const left_arrow = document.getElementsByClassName("uil-arrow-circle-left");
    for (al of left_arrow){
        al.addEventListener("click", function () {
            actual_date.setDate(actual_date.getDate()-7);
            const re = /^.*\s-\s(.*)/;
            const title_search = temp_head.textContent;
            const group_found = title_search.match(re);
            fetchICS("ressources/"+group_found[1]+".ics");

            // Updating the dates under the days
            updateDates();
        });
    }

    // Week change right arrow behaviour
    const right_arrow = document.getElementsByClassName("uil-arrow-circle-right");
    for (ar of right_arrow){
        ar.addEventListener("click", function () {
            actual_date.setDate(actual_date.getDate()+7);
            const re = /^.*\s-\s(.*)/;
            const title_search = temp_head.textContent;
            const group_found = title_search.match(re);
            fetchICS("ressources/"+group_found[1]+".ics");
            updateDates();
        });
    }

});

// Small function to format the date
function formatTime(hour) {
    return `${hour}:00`;
}

// Generating an event bubble
function createBubble(start, end, summary, location, description) {
    const day_number = start.getDay();
    var start_hour = start.toLocaleTimeString('fr-FR');
    start_hour = start_hour.split(":");
    const top_offset = 50 + (parseInt(start_hour[0])-8)*30.35*2 + (parseInt(start_hour[1]))*1.01;
    
    var end_hour = end.toLocaleTimeString('fr-FR');
    end_hour = end_hour.split(":");
    const event_height = (parseInt(end_hour[0]) - parseInt(start_hour[0]))*30.35*2 + (parseInt(end_hour[1]) - parseInt(start_hour[1]))*1.01;

    const column_name = daysOfWeek[day_number-1];
    const column = document.getElementById(column_name);
    events_hour_per_day_list[day_number-1].push(start.toLocaleTimeString('fr-FR'));

    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    
    const time = document.createElement('div');
    time.textContent = start_hour[0]+"h"+start_hour[1]+" - "+end_hour[0]+"h"+end_hour[1];
    time.classList.add("time_text");
    bubble.appendChild(time); //the hovering works !!
    const text_summary = document.createElement('div');
    text_summary.classList.add("text_summary");
    text_summary.textContent = summary;
    bubble.appendChild(text_summary);
    const text_location = document.createElement('div');
    text_location.classList.add("text_location");
    text_location.textContent = location;
    text_location.style.fontSize = 80 +"%";
    bubble.appendChild(text_location);

    bubble.style.top = top_offset +"px";
    bubble.style.height = event_height +"px";
    bubble.classList.add(start.toLocaleTimeString('fr-FR'));
    bubble.classList.add(daysOfWeek[day_number-1]);
    
    switch (actual_data){
        case "S5INF":
            color_data = color_S5INF;
            break;
        case "S6INF":
            color_data = color_S6INF;
            break;
        case "S6GPM":
            color_data = color_S6GPM;
            break;
        default:
            console.log("Pas de couleurs définies.");
    }

    const map_data = new Map(Object.entries(color_data));
    for (const [cle, valeur] of map_data.entries()) {
        if (summary.includes(cle)){
            bubble.style.backgroundColor = valeur;
            break;
        }
      }

    bubble.addEventListener("click", function () {
        // Add your custom click behavior for the bubble here
        alert(description);
    });

    column.appendChild(bubble);
}

function eventGenerator(data){
    var event_counter = 0;
    var ignored_counter = 0;
    const monday_checker = previousMonday();
    const sunday_checker = nextSunday();
    var accu = new Date(monday_checker);
    sunday_checker.setDate(sunday_checker.getDate() - 1); //Avec -2 erreur à la ligne 194 boucle infinie avec +1 si jour 31 un vendredi (corrigé)
    events = ical.parseICS(data);
    for (var k in events) {
        if (events.hasOwnProperty(k)) {
            var ev = events[k];
            if (events[k].type == 'VEVENT') {
                accu = new Date(monday_checker);
                //Si fait partie des jours de la semaine
                while (accu.getDate() != sunday_checker.getDate()){
                    if (accu.getDate() == ev.start.getDate() && accu.getDay() == ev.start.getDay() 
                    && accu.getMonth() == ev.start.getMonth() && accu.getFullYear() == ev.start.getFullYear()){
                        createBubble(ev.start, ev.end, ev.summary, ev.location, ev.description);
                        event_counter++;
                    }
                    else{
                        ignored_counter++;
                    }
                    accu.setDate(accu.getDate()+1);
                }
            }
        }
    }
    console.log("Generated "+event_counter+" events.");
    console.log("Ignored "+ignored_counter+" events.");
    // A refaire pour gérer les cas ou ça ne commence pas à la même heure
    var i = 0;
    for (let d of daysOfWeek){
        const uniq_hours = Array.from(new Set(events_hour_per_day_list[i]));
        for (h of uniq_hours){
            const grouped_events = document.getElementsByClassName(d+" "+h); 
            if (grouped_events.length > 1){
                const corrected_width = 100/grouped_events.length;
                let left_offset = 0;
                for (e of grouped_events){
                    e.style.width = corrected_width +"%";
                    e.style.left = left_offset +"%";
                    left_offset = left_offset + corrected_width;
                    e.style.fontSize = "13px";
                    const location_transform = e.getElementsByClassName("text_location");
                    for (t of location_transform){
                        t.style.fontSize = 70 - 0.25*Math.exp(grouped_events.length) +"%";
                    }
                    const summary_transform = e.getElementsByClassName("text_summary");
                    for (s of summary_transform){
                        s.style.fontSize = 100 - 0.7*Math.exp(grouped_events.length) +"%";
                    }
                }
            }
        }
        i++;
    }

}

function fetchICS(file){
    fetch(file)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }
      return response.text();
    })
    .then(data => {
      document.querySelectorAll(".bubble").forEach(el => el.remove());
      eventGenerator(data);
      getLastExport(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function init_head(ressource){
    head_title = document.getElementById("head_main");
    head_title.textContent = "TimeLarveTable - "+ressource;
}

function updateClock(who) {
    const now = new Date();
    const clockElement = document.getElementById('clock');
    let options;
    let formattedDate;
    if (who === "update") {
        options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        formattedDate = now.toLocaleDateString(undefined, options);
        clockElement.textContent = formattedDate;
    }
    else {
        options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        formattedDate = now.toLocaleDateString("fr-CA", options);
        //formattedDate = formattedDate.replace(/\//g, "-");
    }
    return formattedDate;
}

//On cherche le lundi précédent pour appeler l'emploi du temps à partir de cette date
function previousMonday() {
    const prevMonday = new Date(actual_date);
    const day = prevMonday.getDay();
    let toPrevMonday;
    if (day === 0) {
        toPrevMonday = 6;
    }
    else {
        toPrevMonday = day - 1;
    }
    if (prevMonday.getDate() - toPrevMonday < 0) {
        prevMonday.setDate(-toPrevMonday + prevMonday.getDate());
    }
    else {
        prevMonday.setDate(prevMonday.getDate() - toPrevMonday);
    }
    options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    formattedMonday = prevMonday.toLocaleDateString("fr-CA", options);
    return prevMonday;
}

//Même chose que pour le lundi mais pour le dimanche parce que j'ai la flemme de réfléchir plus
function nextSunday() {
    const nextSunday = new Date(actual_date);
    const day = nextSunday.getDay();
    let toNextSunday;
    let lastDay = new Date(nextSunday.getFullYear(), nextSunday.getMonth() + 1, 0);
    if (day === 0) {
        options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        formattedSunday = nextSunday.toLocaleDateString("fr-CA", options);
    }
    else {
        toNextSunday = 7 - day;
        if (nextSunday.getDate() + toNextSunday > lastDay.getDate()) {
            nextSunday.setDate(toNextSunday - (lastDay.getDate() - nextSunday.getDate()));
            nextSunday.setMonth(nextSunday.getMonth() + 1);
        }
        else {
            nextSunday.setDate(nextSunday.getDate() + toNextSunday);
        }
    }
    options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    formattedSunday = nextSunday.toLocaleDateString("fr-CA", options);
    return nextSunday;
}

function updateDates(){
    var text_date = previousMonday();
    const date_to_update = document.getElementsByClassName("date_under");
    for (dtu of date_to_update){
        formatted_date = text_date.toLocaleDateString("fr-fr", options);
        dtu.textContent = formatted_date;
        text_date.setDate(text_date.getDate()+1);
    }
}

function getLastExport(data){
    var dateHeureString = "Error";
    const regex = /\(Exporté le:(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2})\)/;
    const correspondance = data.match(regex);
    
    if (correspondance && correspondance.length > 1) {
        dateHeureString = correspondance[1];
    }

    const version_div = document.getElementById("version");
    version_div.innerHTML = "Version : "+version+"<br>Last data update : "+dateHeureString;
}