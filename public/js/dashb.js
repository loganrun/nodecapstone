'use strict';
$(function(){
    let properties = [];
   let token = window.localStorage.getItem('token');
  if(!token){
      //.append(not logged in)
      
  // GET LIST OF CURRENT PROPERTIES     
  }else{
      $.ajax({
      method: 'GET',
      contentType: 'application/json',
      processData: false,
      url: 'https://thinkfulnode-loganrun.c9users.io/api/properties',
      headers: {
         Authorization: 'Bearer ' +token
      }
     
    }).done(function(response){
      //console.log(response);
      let currentProperties = response;
      properties.push(...currentProperties);
      console.log(properties);
      displayProperties(properties);
    });
       
  }
    
    //ADD PROPERTIES
    
  $('#prop-add').on('click', (e) =>{
     $('.propertyForm').append(`
    <div class="modal">
        <div class="modal-content" >
        <div class="modal-header">
          <span class="closeBtn">&times;</span>
          <h2>New Property</h2>
        </div>
        <div>
            <form id="addPropForm">
                <input class="propAdd" id="name" placeholder="Property Name" type="text" value="" name="" aria-required="true" required>
                <input class="propAdd" id="street" placeholder="Address" type="text" value="" name="" aria-required="true" required>
                <input class="propAdd" id="city" placeholder="City" type="text" value="" name="" aria-required="true" required>
                <input class="propAdd" id="state" placeholder="State" type="text" value="" name="" aria-required="true" required>
                <input class="propAdd" id="zipcode" placeholder="Zip code" type="text" value="" name="" aria-required="true" required>
                <br></br>
                <button class="submitProp"type="submit">SUBMIT</button>
            </form>
        </div>
        <div class="modal-footer"></div>
    </div>
    `);
  });
   
  $('.propertyForm').on('submit','#addPropForm', (e) =>{
        let name = $('#name').val();
        let street = $('#street').val();
        let city = $('#city').val();
        let state = $('#state').val();
        let zipcode = $('#zipcode').val();
        e.preventDefault();
        //console.log(name,street, city,state, zipcode);
        propertyAddition(name,street, city,state,zipcode);
         $('.propertyForm').empty();
    });
    
    function propertyAddition(name, street, city, state,zipcode){
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      processData: false,
      url: 'https://thinkfulnode-loganrun.c9users.io/api/properties',
      headers: {
         Authorization: 'Bearer ' +token
      },
      data: JSON.stringify({
        name: name,
        street: street,
        city: city,
        state: state,
        zipcode: zipcode
      })
     
    }).done(function(response){
      //console.log(response);
      let newProperties = response;
      properties.push(newProperties);
      //console.log(newProperties);
      displayProperties(properties);
    });
    }
    
    //REMOVE PROPERTIES
    
    $('.propertyCard').on('click',"#delete-property", (e) =>{
     $('.propertyForm').append(`
    <div class="modal">
        <div class="modal-content" >
        <div class="modal-header-warning">
          <span class="closeBtn">&times;</span>
          <h2>Delete Property?</h2>
        </div>
        <div>
            <form id="removePropertiesForm">
            <p> Warning!!! You are about to delete this property and all of its units. 
            If you wish to proceed, click continue.  Otherwise, click the X to close this window.</p>
                
                <br></br>
                <button class="submitProp-warning" id="continueDelete"type="click">CONTINUE</button>
            </form>
        </div>
        <div class="modal-footer"></div>
    </div>
    `);
    });
    
   //ADD UNITS
   
    $('.propertyCard').on('click',"#unit-add", (e) =>{
        let propID = $(e.currentTarget).data("propid");
        //console.log(propID);
     $('.propertyForm').append(`
    <div class="modal">
        <div class="modal-content" >
        <div class="modal-header">
          <span class="closeBtn">&times;</span>
          <h2>New Unit</h2>
        </div>
        <div>
            <form id="addUnitForm">
                <input class="propAdd" id="unitNumber" placeholder="Unit number " type="text" value="" name="" aria-required="true" required>
                <input class="propAdd" id="area" placeholder="Size of unit in square feet" type="text" value="" name="">
                <input class="propAdd" id="bedroom" placeholder="How many bedrooms" type="text" value="" name="" aria-required="true" required>
                <input class="propAdd" id="bathroom" placeholder="How many bathrooms" type="text" value="" name="" aria-required="true" required>
                <input class="propAdd" id="garage" placeholder="Avaiable parking spaces" type="text" value="" name="">
                <input class="propAdd" id="notes" placeholder="Additional info" type="text" value="" name="">
                
                
                <br></br>
                <button class="submitProp"type="submit">SUBMIT</button>
            </form>
        </div>
        <div class="modal-footer"></div>
    </div>
    `);
   });
   
   $('.propertyForm').on('submit','#addUnitForm', (e) =>{
        let unitNumber = $('#unitNumber').val();
        let area = $('#area').val();
        let bedroom = $('#bedroom').val();
        let bathroom = $('#bathroom').val();
        let garage = $('#garage').val();
        let notes = $('#notes').val();
        let property_id =$('#pID').val();
        e.preventDefault();
        //console.log(unitNumber,area, bathroom,bedroom, garage, notes, property_id);
        unitAddition(property_id,unitNumber,area, bedroom,bathroom,garage, notes);
        $('.propertyForm').empty();
    });
    
    function unitAddition(property_id,unitNumber,area, bedroom,bathroom,garage, notes){
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      processData: false,
      url: 'https://thinkfulnode-loganrun.c9users.io/api/properties/'+property_id+'/unit',
      headers: {
         Authorization: 'Bearer ' +token
      },
      data: JSON.stringify({
        unitNumber: unitNumber,
        area: area,
        bedroom: bedroom,
        bathroom: bathroom,
        garage: garage,
        notes:  notes
      })
     
    }).done(function(response){
      //console.log(response);
      let newUnit = response;
      let property = properties.find(prop =>{
          return prop._id == property_id;
      });
        property.units.push(newUnit);
        displayProperties(properties);
    });
    }
    
    //VIEW UNITS
    
     $('.propertyCard').on('click',"#view-unit", (e) =>{
        let propId = $(e.currentTarget).data("propid");
        console.log(propId);
        let currentUnit = properties.find(prop =>{
             return properties.property_id == propId;
         });
         console.log(currentUnit);
        // //displayUnits(currentUnit);
     });


   
   //ADD RESIDENTS/LEASES
  
    $('.propertyCard').on('click',"#lease-add", (e) =>{
     $('.propertyForm').append(`
    <div class="modal">
        <div class="modal-content" >
        <div class="modal-header">
          <span class="closeBtn">&times;</span>
          <h2>New Lease</h2>
        </div>
        <div>
            <form id="introForm">
            <h6>Welcome to the new Lease form</h6>
            <p> Creating a new lease is a two step process.  
            First, you have to set up an account for your resident.  This allows you 
            to begin receiving payment of rent electronically.  After creating the resident account, 
            you will then be able to assign them to a unit and a lease.
            It is not as bad as it sounds...so let's get started!!!</p>
                
                <br></br>
                <button class="submitProp" id="continue"type="click">CONTINUE</button>
            </form>
        </div>
        <div class="modal-footer"></div>
    </div>
    `);
    });
    
    $('.propertyForm').on('click',"#continue", (e) =>{
         $('.propertyForm').empty();
         e.preventDefault();
     $('.propertyForm').append(`
    <div class="modal">
        <div class="modal-content" >
        <div class="modal-header">
          <span class="closeBtn">&times;</span>
          <h2>New Resident</h2>
        </div>
        <div>
            <form id="addResidentForm">
                <input class="propAdd" id="username" placeholder="User Name - email address of tenant " type="text" value="" name="" aria-required="true" required>
                <input class="propAdd" id="password" placeholder="initial password - first and last name of tenant, no spaces" type="text" value="" name="">
                <input class="propAdd" id="firstName" placeholder="first name" type="text" value="" name="" aria-required="true" required>
                <input class="propAdd" id="lastName" placeholder="last name" type="text" value="" name="" aria-required="true" required>
                <input class="propAdd" id="emailAddress" placeholder="emailAddress" type="text" value="" name="">
                <input class="propAdd" id="dateOfBirth" placeholder="Date of birth" type="text" value="" name="">
                <input class="propAdd" id="phoneNumber" placeholder="phone number" type="text" value="" name="">
                <input class="propAdd" id="notes" placeholder="Additional info" type="text" value="" name="">
                <br></br>
                <button class="submitProp"type="submit">SUBMIT</button>
            </form>
        </div>
        <div class="modal-footer"></div>
    </div>`);
    });
    
    $('.propertyForm').on('submit','#addResidentForm', (e) =>{
        let username = $('#username').val();
        let password = $('#password').val();
        let firstName = $('#firstName').val();
        let lastName = $('#lastName').val();
        let emailAddress = $('#emailAddress').val();
        let notes = $('#notes').val();
        let dateOfBirth = $('#dateOfBirth').val();
        let phoneNumber = $('#phoneNumber').val();
        e.preventDefault();
        console.log(username,password, firstName,lastName, emailAddress, notes, dateOfBirth, phoneNumber);
        residentAddition(username,password, firstName,lastName, emailAddress, notes, dateOfBirth, phoneNumber);
        
    });
    
    function residentAddition(username,password, firstName,lastName, emailAddress, notes, dateOfBirth, phoneNumber){
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      processData: false,
      url: 'https://thinkfulnode-loganrun.c9users.io/api/residents',
      headers: {
         Authorization: 'Bearer ' +token
      },
      data: JSON.stringify({
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        dateOfBirth:  dateOfBirth,
        notes:  notes,
        phoneNumber: phoneNumber
      })
     
    }).done(function(response){
      console.log(response);
      let info = response;

    //   $.each(info, (index, item)=>{
    //     let unit = item.units.unitNumber;
    //     let area = item.units.area;
    //     let bedroom = item.units.bedroom;
    //     let bathroom = item.units.bathroom;
    //     let garage = item.units.garage;
    //     let unitId = item.units._id;
    //     console.log(unit, area, bedroom,bathroom,garage,unitId);
    //     // renderUnits(unit, area, bedroom, bathroom, garage,unitId);
    //   });
    });
    }
    
    //CLOSE MODALS
    
    $('.propertyForm').on('click','.closeBtn', (e) =>{
        $('.propertyForm').empty();
        
    });
    
    //DISPLAY FUNCTIONS
    
    function displayProperties(properties){
        $('.propertyCard').empty();
         $.each(properties, (index, item)=>{
            // console.log("display", item);
        let name = item.name;
        let street = item.address.street;
        let city = item.address.City;
        let state = item.address.State;
        let zipcode = item.address.zipcode;
        let propId = item._id;
        let units = item.units;
        //console.log(name, street,city,state,zipcode, propId, units);
        renderPorperties(name, street, city, state, zipcode,propId, units);
      });
    }
    
    function displayUnits(currentUnit){
        $('.propertyCard').empty();
         $.each(currentUnit, (index, item)=>{
            // console.log("display", item);
        let name = item.name;
        let street = item.address.street;
        let city = item.address.City;
        let state = item.address.State;
        let zipcode = item.address.zipcode;
        let propId = item._id;
        let units = item.units;
        //console.log(name, street,city,state,zipcode, propId, units);
        renderPorperties(name, street, city, state, zipcode,propId, units);
      });
    }
    
    
    //RENDER FUNCTION
    
    function renderPorperties(name, street, city, state, zipcode,propId, units){
      $('.propertyCard').append(`<div class="card card-chart">
                            <div class="image">
                                <img src="./images/aptthumb.jpeg"></img>
                            </div>
                            <div class="card-body">
                                <h2>${name}</h2>
                                <h6>${street}</h6>
                                <h6>${city}</h6>
                                <h6>${state}</h6>
                                <h6>${zipcode}</h6>
                                <h6>units-${units.length}</h6>
                                <input id="propid" placeholder="" type="text" value="${propId}">
                            </div>
                            <div class="card-footer">
                                <div class="add-info">
                                    <button class="submitInfo" id="view-unit" type="click" data-propid = "${propId}">View Units</button>
                                    <button class="submitInfo" id="unit-add" type="click" data-propid = "${propId}">Add Units</button>
                                    <button class="submitInfo" id="delete-property" type="click" data-propid = "${propId}">DELETE</button>
                                </div>
                            </div>
                        </div>`);
  }
    
});


// <button class="submitInfo" id="lease-add" type="click">Add Leases</button>
// $('.propertyCard').empty();
//.find('propid').val();//$('#propid').val(); //(this).closest(".card-body").find("#propid").val()
// <input id="pID" placeholder="" type="text" value="${propID}" name="">