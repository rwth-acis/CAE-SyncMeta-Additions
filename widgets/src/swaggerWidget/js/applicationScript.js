/*
 * Copyright (c) 2015 Advanced Community Information Systems (ACIS) Group, Chair
 * of Computer Science 5 (Databases & Information Systems), RWTH Aachen
 * University, Germany All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * Neither the name of the ACIS Group nor the names of its contributors may be
 * used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

 // global variables
var client,
    resourceSpace = new openapp.oo.Resource(openapp.param.space()),
    feedbackTimeout,
    loadedModel = null,
    loadedSwaggerDoc = null,
    iwcClient = null,
    selectedNodeId = null,
    nodeMetadataList = null,
    nodeMetadataSchemas = null,
    schemaList = null,
    swaggerStatus = null;

var iwcHandler = function(y, intent) {
    let data = intent.extras.payload.data.data;
    let jsonData = JSON.parse(data);
    
    if (jsonData) {
        //load metadata details based on widget name
        let componentName = null;
        let nodeId = jsonData.selectedEntityId;
        let nodeType = jsonData.selectedEntityType;

        selectedNodeId = nodeId;

        // only process payload and response
        if (nodeType === "HTTP Payload" || nodeType === "HTTP Response") {
          var model = y.share.data.get('model');
          console.log("====TRY FETCH MODEL=====");
          console.log(model);

          if (model.nodes.hasOwnProperty(nodeId)) {
              console.log("=====NODE DETAILS");
              console.log(model.nodes[nodeId]);
              componentName = model.nodes[nodeId].label.value.value;
              console.log("=====COMPONENT NAME");
              console.log(componentName);

              $('#node-schema').html('<option value="">None</option>');

              // get type and only enable properties when type is JSON
              var attributes = model.nodes[nodeId].attributes;
              for (var property in attributes) {
                var currentAttribute = attributes[property];
                if (currentAttribute.name === "payloadType" || currentAttribute.name === "resultType") {
                  if(currentAttribute.value.value === "JSON") {
                    $("#node-schema").prop('disabled', false);
                    // generate select
                    console.log("GENERATE SELECT");
                    console.log(schemaList.map);
                    for(var key in schemaList.map) {
                      if (key && schemaList.get(key))
                        $('#node-schema').append(`<option value="${key}">${key}</option>`);
                    };
                  } else {
                    $("#node-schema").prop('disabled', true);
                  }
                }
              }

              if (componentName) {
                  $("#node-name").html(componentName);

                  // search for description in map
                  var savedDescription = nodeMetadataList.get(nodeId);
                  if (savedDescription)
                    $("#node-description").val(savedDescription);
                  else
                    $("#node-description").val("");

                  // search for properties in map
                  var savedSchema = nodeMetadataSchemas.get(nodeId);
                  console.log("Current saved schema " + savedSchema);
                  if (savedSchema)
                    $("#node-schema").val(savedSchema);
              }
          }

          $("#node-form").show();
  
        } else {
          // hide node form
          $("#node-form").hide();
        }
    }
};

var clickSchema = function(keyValue) {
  console.log("Schema clicked " + keyValue);
  var jsonProperties = JSON.stringify(schemaList.get(keyValue));
  $("#schema-name").val(keyValue);
  $("#schema-properties").val(jsonProperties);
}

var generateSchemaList = function(y) {
  // generate select
  $('#schema-list').html("");
  console.log("GENERATE SCHEMA LIST");
  for(var key in schemaList.map) {
    $('#schema-list').append(`<li id="${key}" class="list-group-item">${key}</li>`);
  };

  $('#schema-list li').click(function() {
    console.log("li clicked with id " + this.id);
    clickSchema(this.id);
  })

  saveMapNode(y);
}

var saveMapNode = function(y) {

  if(selectedNodeId) {
    nodeMetadataList.set(selectedNodeId, $("#node-description").val());
    nodeMetadataSchemas.set(selectedNodeId, $("#node-schema").val());
  }
  
  console.log(nodeMetadataList);
  console.log(nodeMetadataSchemas);

  // store data
  storeDoc(y);
}

var saveSchema = function(y) {
  var schemaName = $("#schema-name").val();
  var schemaProperties = $("#schema-properties").val();
  schemaList.set(schemaName, JSON.parse(schemaProperties));
  console.log("Schema added");
  console.log(schemaList);
  feedback("Schema added");
  generateSchemaList(y);
}

var deleteSchema = function(y) {
  var schemaName = $("#schema-name").val();
  schemaList.delete(schemaName);
  console.log("Schema deleted");
  console.log(schemaList);
  feedback("Schema deleted");
  generateSchemaList(y);
}

var init = function() {
  // hide node form
  $("#node-form").hide();

  console.log("[Swagger Widget] INIT SWAGGER WIDGET");
  var iwcCallback = function(intent) {
    console.log("****INCOMING INTENT****");
    console.log(intent);
  };
  console.log("CAE HOST " + "@@caehost/CAE");
  client = new Las2peerWidgetLibrary("@@caehost/CAE", iwcCallback);

  spaceTitle = frameElement.baseURI.substring(frameElement.baseURI.lastIndexOf('/') + 1);
    if (spaceTitle.indexOf('#') != -1 || spaceTitle.indexOf('?') != -1) {
        spaceTitle = spaceTitle.replace(/[#|\\?]\S*/g, '');
    }
  
  Y({
        db: {
            name: 'memory' // store the shared data in memory
        },
        connector: {
            name: 'websockets-client', // use the websockets connector
            room: spaceTitle,
            url: '@@yjsserver'
        },
        share: { // specify the shared content
            users: 'Map',
            undo: 'Array',
            redo: 'Array',
            join: 'Map',
            canvas: 'Map',
            nodes: 'Map',
            edges: 'Map',
            userList: 'Map',
            select: 'Map',
            views: 'Map',
            data: 'Map',
            text: "Text",
            swaggerDescription: "Text",
            swaggerVersion: "Text",
            swaggerTermsOfService: "Text",
            swaggerMapNodes: 'Map',
            swaggerMapSchema: 'Map',
            swaggerMapNodeSchema: 'Map',
            swagger: 'Map',
        },
        sourceDir: '@@host/swaggerWidget/js'
        //sourceDir: 'http://localhost:8001/microservicePersistenceWidget/js'
    }).then(function(y) {

        //yjs text binding
        y.share.swaggerDescription.bind(document.querySelector('#description'));
        y.share.swaggerVersion.bind(document.querySelector('#version'));
        y.share.swaggerTermsOfService.bind(document.querySelector('#termsOfService'));

        console.log("[swaggerWidget] Get shared y");
        nodeMetadataList = y.share.swaggerMapNodes;
        nodeMetadataSchemas = y.share.swaggerMapNodeSchema;
        schemaList = y.share.swaggerMapSchema;
        swaggerStatus = y.share.swagger;

        nodeMetadataList.observe(function() {
          console.log("***SWAGGER MAP NODES CHANGES****");
          console.log(nodeMetadataList);
        });

        nodeMetadataSchemas.observe(function() {
          console.log("***SWAGGER MAP NODE SCHEMA CHANGES****");
          console.log(nodeMetadataSchemas);
        });

        schemaList.observe(function() {
          console.log("***SWAGGER MAP SCHEMA LIST CHANGES****");
          console.log(schemaList);
        });

        swaggerStatus.observe(function() {
          console.log("***SWAGGER STATUS CHANGES****");
          clearDivs(y);
          loadModel(y);
        });

        $("#node-description").change(function() {
          console.log("NodeDescription - Saving node properties and description");
          saveMapNode(y);
        });

        $("#node-schema").change(function() {
          console.log("NodeSchema - Saving node properties and description");
          saveMapNode(y);
        });

        $("#description").change(function() {
          console.log("Description - Saving node properties and description");
          saveMapNode(y);
        });

        $("#version").change(function() {
          console.log("Version - Saving node properties and description");
          saveMapNode(y);
        });

        $("#termsOfService").change(function() {
          console.log("Version - Saving node properties and description");
          saveMapNode(y);
        });
        
        console.info('[Swagger Widget] Yjs successfully initialized');

        try {
            console.log("[Swagger Widget] BIND IWC CLIENT");
            iwcClient = new iwc.Client("OPENAPI");
            iwcClient.connect( iwcHandler.bind(this, y) );
        } catch(e){
            console.log("[Swagger Widget] ERROR METADATA WIDGET");
            console.log(e);
        }

        loadModel(y);

        $('#schema-add').on('click', function() {
          saveSchema(y);
        })

        $('#schema-delete').on('click', function() {
          deleteSchema(y);
        })

    });
};

// retrieves the JSON representation of this space
var storeDoc = function(y) {

  if (y.share.data.get('model')) {
    console.log("[Swagger Widget] STORE DOC");
    var componentId = $("#name").val();
    
    var description = $("#description").val();
    var version = $("#version").val();
    var termsOfService = $("#termsOfService").val();

    // process schemas
    var schemasJson = {};
    for (var key in schemaList.map) {
      schemasJson[key] = schemaList.get(key);
    }
    
    var nodeMetadataJson = {};
    // process leftover in node form
    if (selectedNodeId && $("#node-description").val())
      nodeMetadataList.set(selectedNodeId, $("#node-description").val());

    if (selectedNodeId && $("#node-properties").val())
      nodeMetadataProperties.set(selectedNodeId, $("#node-properties").val());
      
    // generate string for method nodes
    for (var key in nodeMetadataList.map) {
      console.log("PROCESS NODE " + key);
      var nodeId = key;
      var nodeDescription = nodeMetadataList.get(key);
      nodeMetadataJson[nodeId] = {};
      if (nodeDescription)
        nodeMetadataJson[nodeId]["description"] = nodeDescription;
    };

    for (var key in nodeMetadataSchemas.map) {
      console.log("PROCESS PROPERTIES NODE " + key);
      var nodeId = key;
      var nodeProperties = nodeMetadataSchemas.get(key);
      if (!nodeMetadataJson[nodeId])
        nodeMetadataJson[nodeId] = {};
      if (nodeProperties)
        nodeMetadataJson[nodeId]["schema"] = nodeProperties;
    };

    console.log("SCHEMAS JSON");
    console.log(schemasJson);

    var infoNode = `{
        "info": {
          "description": "${description}",
          "version": "${version}",
          "termsOfService": "${termsOfService}"
        },
        "definitions": ${JSON.stringify(schemasJson)}, 
        "nodes": ${JSON.stringify(nodeMetadataJson)}
    }`;
    y.share.data.set('metadataDocString', JSON.parse(infoNode));

    console.log("==INFO NODE===");
    console.log(infoNode);
    
    var data = {
      "componentId": componentId,
      "docType": "json",
      "docString": "",
      "docInput": infoNode,
    }

    console.log("[Swagger Widget] ========DATA DOC=========");
    console.log(JSON.stringify(data));

    y.share.data.set('metadataDoc',data);
  }
  else {
    console.log("[Swagger Widget] No model loaded");
    feedback("No model!");
  }
};

var loadDivs = function(data) {
    if (data.docInput) {
    try {
      var jsonSwaggerInputDoc = JSON.parse(data.docInput);
      if (jsonSwaggerInputDoc.info) {
        var description = jsonSwaggerInputDoc.info.description;
        var version = jsonSwaggerInputDoc.info.version;
        var terms = jsonSwaggerInputDoc.info.termsOfService;

        $("#description").val((description) ? description : "");
        $("#version").val((version) ? version : "");
        $("#termsOfService").val((terms) ? terms : "");
      }

      // set description and schema map for nodes
      if (jsonSwaggerInputDoc.nodes) {
        Object.keys(jsonSwaggerInputDoc.nodes).forEach((key) => {
          nodeMetadataList.set(key, jsonSwaggerInputDoc.nodes[key].description);
          nodeMetadataSchemas.set(key, jsonSwaggerInputDoc.nodes[key].schema);
        });
      }

      // set all schemas list
      if (jsonSwaggerInputDoc.definitions) {
        Object.keys(jsonSwaggerInputDoc.definitions).forEach((key) => {
          schemaList.set(key, jsonSwaggerInputDoc.definitions[key]);
          console.log("Set all schemas list");
          console.log(schemaList);
        });
        generateSchemaList();
      }

    } catch(e) {
      console.log(e);
    }
  }
}

var clearDivs = function(y) {
  console.log("[SWAGGER WIDGET] Clear divs");
  $("#name").val("");
  $("#description").val("");
  $("#version").val("");
  $("#termsOfService").val("");

  nodeMetadataList.map = {};
  nodeMetadataSchemas.map = {};
  schemaList.map = {};
  swaggerStatus.map = {};

  console.log("CLEAR FINISHED");
  console.log(y.share);

  $('#node-schema').html('<option value="">None</option>');
  $('#schema-list').html('');
}

// loads the metadata doc from API or yjs
var loadModel = function(y) {
  // retrieve current model from the space and store it
  if (y.share.data.get('model')) {
      console.log('[Swagger Widget] Saved model exists');
      var data = y.share.data.get('model');
      loadedModel = data.attributes.label.value.value;
      // special case if model was only saved in the space (not loaded from db)
      if (loadedModel.toUpperCase() == "Model attributes".toUpperCase()) {
          loadedModel = null;
          feedback("Model was not loaded from database until now..");
      } else {
          $("#name").val(loadedModel);
      }
  } else {
      loadedModel = null;
  }

  // retrieve current model from the space and store it
  if (y.share.data.get('metadataDoc')) {
    console.log("[Swagger Widget] Shared metadata doc found");
    // load model
    var data = y.share.data.get('metadataDoc');
    console.log(data);
    loadedSwaggerDoc = data;
    if(loadedSwaggerDoc.componentId === loadedModel) {
      console.log("[Swagger Widget] Shared metadata have some component id");
      loadDivs(loadedSwaggerDoc);
    } else {
      console.log("[Swagger Widget] Shared metadata doesnt have some component id, load metadata");
      loadedSwaggerDoc = null;
    }
  } else {
      console.log("[Swagger Widget] No shared metadata, load metadata");
      loadedSwaggerDoc = null;
  }

  console.log("[Swagger Widget] Load model");
  if (loadedModel && !loadedSwaggerDoc) {
    console.log("[Swagger Widget] Load metadata for model " + loadedModel);
    // first, clean the current model
    y.share.data.set('metadataDoc', null);
    client.sendRequest("GET", "docs/component/" + loadedModel, "", "application/json", {},
        function(data, type) {
            console.log("[Swagger Widget] Metadata doc loaded!");
            console.log(data);
            loadDivs(data);
            storeDoc(y);
            feedback("Metadata doc loaded, please refresh browser!");
        },
        function(error) {
            console.log(error);
            feedback(error);
        });  
  } else {
      console.log('[Swagger Widget] No shared model');
      return
    }    
};

$(document).ready(function() {
  init();
});

/******************* Helper Functions ********************/

// function that retrieves the model of the current space
var getData = function(type){
  var spaceUri = openapp.param.space(),
      listOfDataUris = [],
      promises = [],
      mainDeferred = $.Deferred(),
      deferred = $.Deferred();

  openapp.resource.get(spaceUri,(function(deferred){

    return function(space){
      var resourceUri, resourceObj, values;
      for(resourceUri in space.data){
        if(space.data.hasOwnProperty(resourceUri)){
          resourceObj = space.data[resourceUri];
          if(resourceObj['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'] &&
              _.isArray(resourceObj['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'])){

            values = _.map(resourceObj['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'],function(e){
              return e.value;
            });

            if(_.contains(values,"http://purl.org/role/terms/Data") && _.contains(values,type)){
              listOfDataUris.push(resourceUri);
            }

          }
        }
      }
      deferred.resolve();
    };

  })(deferred));
  promises.push(deferred.promise());

  $.when.apply($,promises).then(function(){
    mainDeferred.resolve(listOfDataUris);
  });

  return mainDeferred.promise();
};

// displays a message in the status box on the screen for the time of "feedbackTimeout"
feedback = function(msg){
    $("#status").val(msg);
    clearTimeout(feedbackTimeout);
    feedbackTimeout = setTimeout(function(){
      $("#status").val("");
    },6000);
};
