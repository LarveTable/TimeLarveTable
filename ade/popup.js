var state = "first";
var dept = "none";
var semester = "none";
var choices = [];
var choices_set = new Set();

// Wait for the page to fully load
document.addEventListener("DOMContentLoaded", function() {
    // Select all checkboxes
    var checkboxes = document.querySelectorAll('.checkbox-input');

    var checkboxes_first = document.querySelector('.first');
    var checkboxes_second = document.querySelector('.second');
    var checkboxes_second_stpi = document.querySelector('.second-STPI');
    var return_button = document.getElementById('return');
  
    // Iterate over each checkbox
    checkboxes.forEach(function(checkbox) {
      // Add click event listener to each checkbox
      checkbox.addEventListener('click', function() {
        // Get the label text associated with the checkbox
        var labelText = checkbox.closest('.checkbox-wrapper').querySelector('.checkbox-label').textContent;


        // Uncheck every other checkbox
        checkboxes.forEach(function(otherCheckbox) {
            if (otherCheckbox !== checkbox) {
              otherCheckbox.checked = false;
            }
          });


        var parent = checkbox.parentNode;
        while (parent) {
            if (parent.classList && parent.classList.contains('first')) {
                dept = labelText;
                // Fade every checkbox
                checkboxes_first.classList.add('fade-out');

                if (labelText == "STPI"){
                    checkboxes_second_stpi.classList.remove('fade-out');
                    checkboxes_second_stpi.classList.add('fade-in');
                    state = "second";
                }
                else{
                    checkboxes_second.classList.remove('fade-out');
                    checkboxes_second.classList.add('fade-in');
                    state = "second";
                }
                return_button.classList.remove('fade-out');
                return_button.classList.add('fade-in');
                return_button.classList.add('btn');
            }

            if (parent.classList && parent.classList.contains('second')) {
                semester = labelText;
                // Fade every checkbox
                checkboxes_second.classList.remove('fade-in');
                checkboxes_second.classList.add('fade-out');

                choices = binds();
                to_display = gen_container(choices);

                var checkboxes_third = document.querySelector(to_display);

                checkboxes_third.classList.remove('fade-out');
                checkboxes_third.classList.add('fade-in');
                state = "third";
                break;
            }

            parent = parent.parentNode;
        }
      });
    });

    document.getElementById('return').addEventListener('click', function(e) {
        if (state == "second"){
            checkboxes_second.classList.remove('fade-in');
            checkboxes_second.classList.add('fade-out');
            checkboxes_second_stpi.classList.remove('fade-in');
            checkboxes_second_stpi.classList.add('fade-out');
            checkboxes_first.classList.remove('fade-out');
            state = "first";
            return_button.classList.remove('fade-in');
            return_button.classList.add('fade-out');
            return_button.classList.remove('btn');
        }
        else if (state == "third"){
            var checkboxes_third = document.querySelector('.third-'+dept+"-"+semester);
            checkboxes_third.classList.remove('fade-in');
            checkboxes_third.classList.add('fade-out');
            checkboxes_second.classList.remove('fade-out');
            checkboxes_second.classList.add('fade-in');
            state = "second";
        }
    });

    document.getElementById('validate').addEventListener('click', function(e) {
      if (choices_set.size != 0){
        // Convert the set to a string separated by commas
        choices_set_string = Array.from(choices_set).join(",");
        setCookie("choices", choices_set_string, 365);
        var list_choices = choices_set_string.split(",");
        actual_data = list_choices;
        init_head(actual_data);
        for (c of list_choices){
            fetchICS("ressources/"+c+".ics");
        }
        var popup = document.getElementsByClassName("popup-wrapper")[0];
        popup.classList.remove("fade-in");
        popup.classList.add("fade-out");
        var schedule = document.getElementsByClassName("schedule-wrapper")[0];
        schedule.classList.remove("fade-out");
        schedule.classList.add("fade-in");
      }
    });

  });

  function gen_container(choices){
    // Si il est déjà généré on le retourne
    if (document.querySelector('.third-'+dept+'-'+semester) != null){
      return '.third-'+dept+'-'+semester;
    }
    else{
      // Création de l'élément div.container
      var container = document.createElement('div');
      container.classList.add('container', 'third-'+dept+'-'+semester, 'fade-out');

      // Création de l'élément de texte
      var textElement = document.createElement('p');
      textElement.textContent = "Select your group, options, etc.";
      textElement.classList.add('checkbox-group-legend');

      // Ajout de textElement à container
      container.appendChild(textElement);

      // Création de l'élément ul.ks-cboxtags
      var ul = document.createElement('ul');
      ul.classList.add('ks-cboxtags');

      // Création des données pour les checkboxes à partir de la liste de labels

      if (choices == undefined){
          console.log("Error. No choices available");
      }
      else{
        var checkboxData = choices.map(function(label, index) { // map = on applique à chaque
          return {
              id: 'checkbox' + (index + 1), // Incrémentation de l'ID à partir de 1
              value: label, // Utilisation de la chaîne de caractères comme valeur
              label: label
          };
        });
      }

      // Création des éléments li, input et label pour chaque entrée dans le tableau de données
      checkboxData.forEach(function(data) {
        var li = document.createElement('li');
        var input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('id', data.id+'-'+dept+semester);
        input.setAttribute('value', data.value);
        input.addEventListener('click', function(e) {
            if (input.checked){
                choices_set.add(dept+semester+data.label);
                const val = document.getElementById('validate');
                val.classList.remove('fade-out');
                val.classList.add('fade-in');
            }
            else{
                choices_set.delete(dept+semester+data.label);
                if (choices_set.size == 0){
                    const val = document.getElementById('validate');
                    val.classList.remove('fade-in');
                    val.classList.add('fade-out');
                }
            }
        });
        var label = document.createElement('label');
        label.setAttribute('for', data.id+'-'+dept+semester);
        label.textContent = data.label;
        
        li.appendChild(input);
        li.appendChild(label);
        ul.appendChild(li);
      });

      // Ajout de ul à container
      container.appendChild(ul);

      // Ajout de container à body (ou à un autre élément parent de votre choix)
      popup = document.getElementById('pop-up');
      popup.appendChild(container);

      return '.third-'+dept+'-'+semester;
    }
  }
  
  function binds(){
    switch (dept){
      case "INFO":
        switch (semester){
            case "S5":
              choices_list = ["G1.1", "G1.2", "G2.1", "G2.2"];
              return choices_list;
            case "S6":
              choices_list = ["G1.1", "G1.2", "G2.1", "G2.2", "IAGA", "IAGB", "SECUGA", "SECUGB", "IAJ", "PM", "ROBO"];
              return choices_list;
            case "S7":
              choices_list = ["G1.1", "G1.2", "G2.1", "G2.2", "IAGA", "IAGB", "IG", "IOT", "REPRO", "RV", "SANTE", "SECUGA", "SECUGB"];
              return choices_list;
            case "S8":
              choices_list = ["G1.1", "G1.2", "G2.1", "G2.2", "CLOUDS", "DATA", "M&I", "SECU", "IA", "IOT", "PM", "ROBO", "RIE"];
              return choices_list;
            case "S9":
              choices_list = ["A", "B", "C", "D", "E", "F", "G", "TD1", "TD2", "TP1", "TP2", "TP3", "CLOUDS", "DATA", "M&I", "SECU", "IOT", "MIV", "OPT", "SANTE", "SPECIF"];
              return choices_list;
            case "S10":
              choices_list = ["A", "B", "C", "D"];
              return choices_list;
            default:
              console.log("Error. No semester selected");
        }
        break;
      case "GPM":
        switch (semester){
          case "S5":
            break;
          case "S6":
            choices_list = ["B2C", "AB1", "A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3"];
            return choices_list;
            break;
          case "S7":
            break;
          case "S8":
            choices_list = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4"];
            return choices_list;
            break;
          case "S9":
            break;
          case "S10":
            break;
          default:
            console.log("Error. No semester selected");
        }
        break;
      case "GCU":
        switch (semester){
          case "S5":
            break;
          case "S6":
            break;
          case "S7":
            break;
          case "S8":
            break;
          case "S9":
            break;
          case "S10":
            break;
          default:
            console.log("Error. No semester selected");
        }
        break;
      case "GMA":
        switch (semester){
          case "S5":
            break;
          case "S6":
            break;
          case "S7":
            break;
          case "S8":
            break;
          case "S9":
            break;
          case "S10":
            break;
          default:
            console.log("Error. No semester selected");
        }
        break;
      case "DMA":
        switch (semester){
          case "S5":
            break;
          case "S6":
            break;
          case "S7":
            break;
          case "S8":
            break;
          case "S9":
            break;
          case "S10":
            break;
          default:
            console.log("Error. No semester selected");
        }
        break;
      case "STPI":
        switch (semester){
          case "S5":
            break;
          case "S6":
            break;
          case "S7":
            break;
          case "S8":
            break;
          case "S9":
            break;
          case "S10":
            break;
          default:
            console.log("Error. No semester selected");
        }
        break;
      case "EII":
        switch (semester){
          case "S5":
            break;
          case "S6":
            break;
          case "S7":
            break;
          case "S8":
            choices_list = ["AINR", "ASTD", "BINR", "BSTD"];
            return choices_list;
            break;
          case "S9":
            break;
          case "S10":
            break;
          default:
            console.log("Error. No semester selected");
        }
        break;
      case "E&T":
        switch (semester){
          case "S5":
            break;
          case "S6":
            break;
          case "S7":
            break;
          case "S8":
            break;
          case "S9":
            break;
          case "S10":
            break;
          default:
            console.log("Error. No semester selected");
        }
        break;

      default:
          console.log("Error. No department selected");
    }
  }

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}