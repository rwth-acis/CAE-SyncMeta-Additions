import Segment from "./Segment";
import ProtectedSegment from "./ProtectedSegment";
import CompositeSegment from "./CompositeSegment";

let _parseSegments = function(segments,text,s=0,depth=0,parent){
  let res = {};
  let indexes = [];
  for(let i=0;i<segments.length;i++){
    let segment = segments[i];
    if (segment.type === "composite" || segment.type === "appendableVariable") {
      let sub = _parseSegments(segment.traceSegments,text,s,depth+1,segment.id);
      let subS = sub.traceSegments.segments;
      let subI = sub.traceSegments.indexes;
      let length = 0;

      for(let ii=0;ii<subI.length;ii++){
        let id= subI[ii].id;
        if ( subS.hasOwnProperty(id) ) {
          length+=subS[id].getLength();
        }
      }

      for(let id in subS){
        if ( subS.hasOwnProperty(id) ){
          if(!res.hasOwnProperty(id) ) {
            res[id]=subS[id];
          }
        }
      }

      res[segment.id] = new CompositeSegment(segment.id,parent,subI.map( elm => subS[elm.id]), segment.type );
      indexes.push({id:segment.id,children:subI});
      s+=length;

    }else{
      let {length,type,id,orderAble=false,integrityCheck}=segment;
      length = parseInt(length);
      let isProtected = type === "protected";
      let value= text.slice(s,s+length);

      if ( !res.hasOwnProperty(id) ) {
        let seg;
        if (isProtected) {
          seg = new ProtectedSegment(value,id,parent);
        }else{
          seg = new Segment(value,id,parent);
          if(integrityCheck){
            seg.setHash(segment["hash"]);
          }
        }
        res[id]=seg;
      }
      indexes.push({id});
      s+=length;
    }
  }
  return {
    traceSegments:{
      indexes,
      segments:res,
    }
  };
}

/**
*  Class representing the trace model of a file. Furthermore, the class
*  parses the given model and divides the file into its segments.
*/

class TraceModel{

  /**
  *  @param {object} model                       - The model that should be used
  *  @param {string} model.text                  - The file content
  *  @param {object} model.traces                - The traces of the file
  *  @param {object} model.traces.traceSegments  - The traceable segments of the file
  */

  constructor(model){
    this.model = model;
    this.indexes=[];
    this.segments={};
    this.traces = {};
  }

  /**
  *  Returns the segment with the given id
  *  @param {string} id  - The id of the segment
  */

  getSegmentById(id){
    return this.segments[id];
  }

  /**
  * Returns the id of the code generation
  * @return {string}  - The id of the code generation
  */

  getGenerationId(){
    return this.model.traces.generationId;
  }

  /**
  *  Parses the currently set model. It will creates an internal array for the segments order and an array for the segments themselves
  */

  parseModel(){
    let {traces : traceModel,text} = this.model;
    let {traceSegments, traces} = traceModel;
    let res =_parseSegments(traceSegments,text);
    this.indexes = res.traceSegments.indexes;
    this.segments = res.traceSegments.segments;
    this.traces = traces;
  }

  /**
  *  Returns the name and id of the model linked to the segment, used for the commit message
  *  @param {string} segmentId    - The segment id
  *  @param {boolean} [withType]  - If true, the model name will also contain the model type
  *  @return {object}             - The name and id of the model element
  */

  getModelInformation(segmentId, withType=false){
    let {modelId,model} = this.getModel(segmentId);
    if(!model){
      return`Untraced Segment[${segmentId}]`;
    }else{
      let modelName = model.name;
      if(withType && model.type && model.type.length > 0){
        if(model.type != modelName){
          modelName = `${model.type}[${modelName}]`
        }
      }
      return {modelId,modelName};
    }
  }

  /**
   *	@typedef TraceModel~Model
   *	@type object
   *	@property {string} modelId    - The id of the model element
   *	@property {object} model      - The model element
   *	@property {string} model.name - The name of the model element
   *	@property {string} [model.type]  - An optional type of the model element
   */

  /**
   *	Returns the model and its model id that are linked to the given segment. If we cant find a model for that segment and the segment does have a parent,
   *	we try to findcthe model if its parent.
   *	@param {string} segmentId          - The segment of the id
   *	@return {TraceModel~Model|boolean} - The linked model or false if the model was not found
   */

  getModel(segmentId){
    let segment = this.segments[segmentId];
    if(segment){
      for(let modelId in this.traces){
        if(this.traces.hasOwnProperty(modelId)){
          let model = this.traces[modelId];
          let segments = model.segments.filter( segment => segment == segmentId);
          if(segments && segments.length > 0){
            return {modelId,model};
            break;
          }
        }
      }
      //if we dont find the model yet, we will return the linked model of the parent
      if( segment.getParent() ){
        return this.getModel(segment.getParent());
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  /**
   *	Return the segments
   *	@return {object[]} - The segments
   */

  getSegments(){
    return this.segments;
  }

  /**
  *  Returns the content of the file holded by the trace model
  *  @return {string} - The content of the file
  */

  getContent(){
    return this.getFlattenIndexes().map( function(elm){
      return this.getSegmentById(elm.id).toString()
    }.bind(this)).join("");
  }

  /**
  *  Sets new indexes, i.e. new order of the segments
  *  @param {Object[]} indexes - The new indexes
  */

  setIndexes(indexes){
    this.indexes=indexes;
  }

  /**
  *  Returns the current indexes
  *  @return {Object[]} - The indexes, i.e. order of the segments
  */

  getIndexes(){
    return this.indexes;
  }

  getFlattenSubIndexes(indexes,withComposites=false){
    let res=[];
    for(let i=0;i<indexes.length;i++){
      let index = indexes[i];
      if (index.children) {
        let sub = this.getFlattenSubIndexes(index.children,withComposites);
        res = res.concat(sub);
        if (withComposites) {
          res.push(index);
        }
      }else{
        res.push({id:index.id});
      }
    }
    return res;
  }

  /**
   *  Returns the flatten indexes of the segments of the trace model, that is, returns the nested segments in composition to a not nested sequence of ids.
   *  @param [boolean]  withComposites  - Determines if the indexes of compositions of segments should also be included
   */

  getFlattenIndexes(withComposites=false){
    return this.getFlattenSubIndexes(this.indexes,withComposites);
  }

  /**
   *  Serialize a given subset of segments to JSON
   *  @param {object[]} children              - The ids of the segments that should be serializeModel
   *  @param {string}   children[].id         - The id of the segment
   *  @param {object[]} [children[].children] - The list of children/sub segments of compositions of segments
   *  @return {object}                        - The serialized segments as json object
   */

  toJSON(children){
    let traceSegments = [];
    let indexes = children || this.indexes;
    for(let i=0;i<indexes.length;i++){
      let index = indexes[i];
      let segment = this.segments[index.id];
      if (segment instanceof CompositeSegment) {
        let children = this.toJSON(index.children);
        traceSegments.push({
          id:index.id,
          type: segment.getType(),
          traceSegments: children.traceSegments
        });
      }else{
        let type = segment instanceof ProtectedSegment ? "protected" : "unprotected";
        let segmentData = {
          id:index.id,
          type: type,
          length: segment.toString().length
        }

        if(type === "unprotected"){
          if(segment.integrityCheck){
            segmentData["integrityCheck"] = true;
            segmentData["hash"] = segment.hash;
          }else{
            segmentData["integrityCheck"] = false;
          }
        }

        traceSegments.push(segmentData);
      }
    }
    let model = {
      generationId: this.getGenerationId(),
      traces: this.model.traces.traces,
      traceSegments: traceSegments
    };
    return model;
  }
}
export default TraceModel;