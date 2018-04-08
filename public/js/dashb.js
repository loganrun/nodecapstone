'use strict';
$(function(){
   let properties = [];
   let token = window.localStorage.getItem('token');
  if(!token){
      window.location = 'ownlog.html';
      
  // GET LIST OF CURRENT PROPERTIES     
  }else{
      $.ajax({
      method: 'GET',
      contentType: 'application/json',
      processData: false,
      url: 'https://propmanagenodecap.herokuapp.com/api/properties',
      headers: {
         Authorization: 'Bearer ' +token
      }
     
    }).done(function(response){
      let currentProperties = response;
      properties.push(...currentProperties);
      displayProperties(properties);
      
    });
       
  }
  
  $('.navbar-wrapper').on('click','#menu-button',(e) =>{
      e.preventDefault();
          $('.sidebar').toggleClass('slide');
  }); 
  
  $('.sidebar').on('click', '.close', (e)=>{
     e.preventDefault() ;
     $('.sidebar').toggleClass('slide');
  });
    //ADD PROPERTIES
    
  $('.navbar').on('click','#add-property', (e) =>{
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
        propertyAddition(name,street, city,state,zipcode);
         $('.propertyForm').empty();
    });
    
    function propertyAddition(name, street, city, state,zipcode){
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      processData: false,
      url: 'https://propmanagenodecap.herokuapp.com/api/properties',
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
      let newProperties = response;
      properties.push(newProperties);
      displayProperties(properties);
    });
    }
    
    //REMOVE PROPERTIES
    
    $('.propertyCard').on('click',"#delete-property", (e) =>{
        let propID = $(e.currentTarget).data("propid");
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
            <input id="pID" placeholder="" type="text" value="${propID}" name="">
                
                <br></br>
                <button class="submitProp-warning" id="continueDelete"type="submit">CONTINUE</button>
            </form>
        </div>
        <div class="modal-footer"></div>
    </div>
    `);
    });
    
    $('.propertyForm').on('submit','#removePropertiesForm', (e) =>{
        let property_id = $('#pID').val();
        console.log(property_id);
        propertyRemove(property_id);
        $('.propertyForm').empty();
         e.preventDefault();
    });
    
    function propertyRemove(property_id){
     $.ajax({
      method: 'DELETE',
      contentType: 'application/json',
      processData: false,
      url: 'https://propmanagenodecap.herokuapp.com/api/properties/'+property_id+'/delete',
      headers: {
        Authorization: 'Bearer ' +token
       },
     }).done(function(response){
       let removedProperties = response;
       console.log(removedProperties._id);
       properties = properties.filter(property =>{
           return property._id !==  removedProperties._id;
       });
      displayProperties(properties);
     });
    }
    
   //ADD UNITS
   
    $('.navbar').on('click',"#add-units", (e) =>{
        let propID = $(e.currentTarget).data("propid");
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
                <input id="pID" placeholder="" type="text" value="${propID}" name="">
                
                
                <br></br>
                <button class="submitProp"type="submit">SUBMIT</button>
            </form>
        </div>
        <div class="modal-footer"></div>
    </div>
    `);
   });
   
   $('.propertyCard').on('click',"#unit-add", (e) =>{
        let propID = $(e.currentTarget).data("propid");
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
                <input id="pID" placeholder="" type="text" value="${propID}" name="">
                
                
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
        unitAddition(property_id,unitNumber,area, bedroom,bathroom,garage, notes);
        $('.propertyForm').empty();
    });
    
    function unitAddition(property_id,unitNumber,area, bedroom,bathroom,garage, notes){
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      processData: false,
      url: 'https://propmanagenodecap.herokuapp.com/api/properties/'+property_id+'/unit',
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
      console.log(response);
      let newUnit = response;
      let property = properties.find(prop =>{
          return prop._id == property_id;
      });
      
        property.units.push(newUnit);
        displayProperties(properties);
    });
    }
    
    //REMOVE UNITS
    
    $('.propertyCard').on('click',"#delete-unit", (e) =>{
        let unitID = $(e.currentTarget).data("unitid");
        let propID = $(e.currentTarget).data("propid");
        
     $('.propertyForm').append(`
    <div class="modal">
        <div class="modal-content" >
        <div class="modal-header-warning">
          <span class="closeBtn">&times;</span>
          <h2>Delete Unit?</h2>
        </div>
        <div>
            <form id="removeUnitForm">
            <p> Warning!!! You are about to delete this unit. 
            If you wish to proceed, click continue.  Otherwise, click the X to close this window.</p>
            <input id="pID" placeholder="" type="text" value="${propID}" name="">
            <input id="unitid" placeholder="" type="text" value="${unitID}">
                
                <br></br>
                <button class="submitProp-warning" id="continueDelete"type="submit">CONTINUE</button>
            </form>
        </div>
        <div class="modal-footer"></div>
    </div>
    `);
    });
    
    $('.propertyForm').on('submit','#removeUnitForm', (e) =>{
        e.preventDefault();
        let property_id = $('#pID').val();
        let unit_id = $('#unitid').val();
        unitRemove(property_id, unit_id);
        $('.propertyForm').empty();
         
    });
    
    function unitRemove(property_id, unit_id){
     $.ajax({
      method: 'DELETE',
      contentType: 'application/json',
      processData: false,
      url: 'https://propmanagenodecap.herokuapp.com/api/properties/'+property_id+'/'+unit_id,
      headers: {
        Authorization: 'Bearer ' +token
       },
     }).done(function(response){
       let returnedUnits = response;
      console.log(returnedUnits);
       let unitProperty = properties.find(property =>{
             return property._id == returnedUnits._id;
         });
         unitProperty.units = returnedUnits.units;
      displayUnits(unitProperty, unitProperty.units);
     });
    }
    
    
    
    //VIEW UNITS
    
     $('.propertyCard').on('click',"#view-unit", (e) =>{
        let propId = $(e.currentTarget).data("propid");
        let currentUnit = properties.find(property =>{
             return property._id == propId;
         });
         if (currentUnit.units.length  >= 1) {
             
         
         let unitInfo = currentUnit.units.map(unit =>{
             return unit;
         });
        displayUnits(currentUnit, unitInfo);
         }else{
             $('.propertyForm').append(`
        <div class="modal">
        <div class="modal-content" >
        <div class="modal-header-caution">
          <span class="closeBtn">&times;</span>
          <h2>No Units</h2>
        </div>
        <div>
            <form id="noUnitsForm">
            <p> This property has no units. Please add units and try again.</p>
            
                
                <br></br>
                <button class="submitProp-caution" id="back"type="click">CONTINUE</button>
            </form>
        </div>
        <div class="modal-footer"></div>
        </div>
            `);
            
        $('.propertyForm').on('click',"#back", (e) =>{
        displayProperties(properties); 
     });
            
         }
     });
     
     $('.propertyCard').on('click',"#returnToProperties", (e) =>{
        displayProperties(properties); 
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
        $('.panel-header').empty();
         $.each(properties, (index, item)=>{
        let name = item.name;
        let street = item.address.street;
        let city = item.address.City;
        let state = item.address.State;
        let zipcode = item.address.zipcode;
        let propId = item._id;
        let units = item.units;
        renderPorperties(name, street, city, state, zipcode,propId, units);
      });
        renderPropertyHeader();
        renderPropertyButton();
    }
    
    function displayUnits(currentUnit, unitInfo){
        $('.propertyCard').empty();
        $('.panel-header').empty();
        let name = currentUnit.name;
        let property_id = currentUnit._id;
        $.each(unitInfo, (index, item)=>{
        let unitNumber = item.unitNumber;
        let bedroom = item.bedroom;
        let bathroom = item.bathroom;
        let garage = item.garage;
        let unitId = item._id;
       renderUnits(name,property_id, unitNumber, bedroom, bathroom, garage,unitId);
      });
      renderUnitsHeader();
      renderUnitsButton();
    }
    
    
    
    
    
    //RENDER FUNCTION
    
    function renderPropertiesNew(){
        $('.panel-header').append(`<h2>WELCOME! CLICK THE BUTTON TO ADD YOUR FIRST PROPERTY</h2>`);
        
    }
    
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
                                <h6 id="unitsNum" data-units = ${units.length}>units-${units.length}</h6>
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
  
   function renderPropertyHeader(){
       $('.panel-header').append(`<h2>WELCOME TO YOUR PROPERTIES PAGE</h2>`);
      
  }
  
   function renderPropertyButton() {
       $('.navbar').append(`<div class = "add-property"><button class = "fa-button" id="add-property"> + </button></div>`);
   }
  
  function renderUnits(name, property_id,unitNumber, bedroom, bathroom, garage,unitId){
      $('.propertyCard').append(`<div class="card card-chart">
                            <div class="image">
                                <img src="./images/liv-thumb.jpeg"></img>
                            </div>
                            <div class="card-body">
                                <h2>${name}</h2>
                                <h6>Apt# ${unitNumber}</h6>
                                <h6>Bedrooms: ${bedroom}</h6>
                                <h6>Bathrooms: ${bathroom}</h6>
                                <h6>Parking: ${garage}</h6>
                                <input id="unitid" placeholder="" type="text" value="${unitId}">
                            </div>
                            <div class="card-footer">
                                <div class="add-info">
                                    <button class="submitInfo" id="returnToProperties" type="click" data-unitid = "${unitId}">View Properties</button>
                                    <button class="submitInfo" id="delete-unit" type="click" data-unitid = "${unitId}" data-propid = "${property_id}">DELETE</button>
                                </div>
                            </div>
                        </div>`);
  }
  
  function renderUnitsHeader(){
      $('.panel-header').append(`<h2>WELCOME TO YOUR UNITS PAGE</h2>`)
      
  }
  
  function renderUnitsButton() {
       $('.navbar').append(`<div class = "add-units"><button class = "fa-button" id="add-units"> + </button></div>`);
   }
    
});

