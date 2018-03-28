'use strict';
$(function(){
   let token = window.localStorage.getItem('token');
  if(!token){
      //.append(not logged in)
       
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
      console.log(response);
      let info = response;

      $.each(info, (index, item)=>{
        let name = item.name;
        let street = item.address.street;
        let city = item.address.City;
        let state = item.address.State;
        let zipcode = item.address.zipcode;
        let propId = item._id;
        console.log(name, street,city,state,zipcode, propId);
        renderPorperties(name, street, city, state, zipcode,propId);
      });
    });
       
  }
  
  function renderPorperties(name, street, city, state, zipcode,propId){
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
                                <h6>Unit#</h6>
                                <input id="propid" placeholder="" type="text" value="${propId}">
                            </div>
                            <div class="card-footer">
                                <div class="add-info">
                                    <button class="submitInfo" id="unit-add" type="click">Add Units</button>
                                    <button class="submitInfo" id="lease-add" type="click">Add Leases</button>
                                </div>
                            </div>
                        </div>`
          )
  }
  
   $('.propertyForm').on('click','.closeBtn', (e) =>{
        $('.propertyForm').empty();
        
    });
    
   $('#prop-add').on('click', (e) =>{
     $('.propertyForm').append(`
    <div class="modal">
        <div class="modal-content" >
        <div class="modal-header">
          <span class="closeBtn">&times;</span>
          <h2>New Property</h2>
        </div>
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
        console.log(name,street, city,state, zipcode);
        propertyAddition(name,street, city,state,zipcode);
        
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
      console.log(response);
      let info = response;

      $.each(info, (index, item)=>{
        let name = item.name;
        let street = item.address.street;
        let city = item.address.City;
        let state = item.address.State;
        let zipcode = item.address.zipcode;
        let propId = item._id;
        console.log(name, street,city,state,zipcode, propId);
        renderPorperties(name, street, city, state, zipcode,propId);
      });
    });
    }
    
    
    $('.propertyCard').on('click',"#unit-add", (e) =>{
        let propID = $('#propid').val();
        console.log(propID);
     $('.propertyForm').append(`
    <div class="modal">
        <div class="modal-content" >
        <div class="modal-header">
          <span class="closeBtn">&times;</span>
          <h2>New Unit</h2>
        </div>
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
        console.log(unitNumber,area, bathroom,bedroom, garage, notes, property_id);
        unitAddition(property_id,unitNumber,area, bedroom,bathroom,garage, notes);
        
    })
    
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
      console.log(response);
      let info = response;

      $.each(info, (index, item)=>{
        let unit = item.units.unitNumber;
        let area = item.units.area;
        let bedroom = item.units.bedroom;
        let bathroom = item.units.bathroom;
        let garage = item.units.garage;
        let unitId = item.units._id;
        console.log(unit, area, bedroom,bathroom,garage,unitId);
        // renderUnits(unit, area, bedroom, bathroom, garage,unitId);
      });
    });
    }
    
    $('.propertyCard').on('click',"#lease-add", (e) =>{
     $('.propertyForm').append(`
    <div class="modal">
        <div class="modal-content" >
        <div class="modal-header">
          <span class="closeBtn">&times;</span>
          <h2>New Lease</h2>
        </div>
            <form id="addUnitForm">
                <input class="propAdd" id="unitNumber" placeholder="Unit number " type="text" value="" name="" aria-required="true" required>
                <input class="propAdd" id="area" placeholder="Size of unit" type="text" value="" name="">
                <input class="propAdd" id="bedroom" placeholder="How many bedrooms" type="text" value="" name="" aria-required="true" required>
                <input class="propAdd" id="bathroom" placeholder="How many bathrooms" type="text" value="" name="" aria-required="true" required>
                <input class="propAdd" id="garage" placeholder="Avaiable parking spaces" type="text" value="" name="">
                <input class="propAdd" id="notes" placeholder="Additional info" type="text" value="" name="">
                <br></br>
                <button class="submitProp"type="submit">SUBMIT</button>
            </form>
        </div>
    </div>
    `);
    }
    
    // $('.propertyCard').on('click',"#lease-add", (e) =>{
    //  $('.propertyForm').append(`
    // <div class="modal">
    //     <div class="modal-content" >
    //     <div class="modal-header">
    //       <span class="closeBtn">&times;</span>
    //       <h2>New Lease</h2>
    //     </div>
    //         <form id="addUnitForm">
    //             <input class="propAdd" id="unitNumber" placeholder="Unit number " type="text" value="" name="" aria-required="true" required>
    //             <input class="propAdd" id="area" placeholder="Size of unit" type="text" value="" name="">
    //             <input class="propAdd" id="bedroom" placeholder="How many bedrooms" type="text" value="" name="" aria-required="true" required>
    //             <input class="propAdd" id="bathroom" placeholder="How many bathrooms" type="text" value="" name="" aria-required="true" required>
    //             <input class="propAdd" id="garage" placeholder="Avaiable parking spaces" type="text" value="" name="">
    //             <input class="propAdd" id="notes" placeholder="Additional info" type="text" value="" name="">
    //             <br></br>
    //             <button class="submitProp"type="submit">SUBMIT</button>
    //     </form>
    //     </div>
    // </div>
    // `);
    // }
    
    $('.propertyForm').on('submit','#addUnitForm', (e) =>{
        let unitNumber = $('#unitNumber').val();
        let area = $('#area').val();
        let bedroom = $('#bedroom').val();
        let bathroom = $('#bathroom').val();
        let garage = $('#garage').val();
        let notes = $('#notes').val();
        let property_id =$('#pID').val();
        e.preventDefault();
        console.log(unitNumber,area, bathroom,bedroom, garage, notes, property_id);
        unitAddition(property_id,unitNumber,area, bedroom,bathroom,garage, notes);
        
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
      console.log(response);
      let info = response;

      $.each(info, (index, item)=>{
        let unit = item.units.unitNumber;
        let area = item.units.area;
        let bedroom = item.units.bedroom;
        let bathroom = item.units.bathroom;
        let garage = item.units.garage;
        let unitId = item.units._id;
        console.log(unit, area, bedroom,bathroom,garage,unitId);
        // renderUnits(unit, area, bedroom, bathroom, garage,unitId);
      });
    });
    }
    
    //Render Functions
    
});