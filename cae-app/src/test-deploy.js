import { LitElement, html } from "lit-element";
import "./versioning/versioning-element.js";
import Common from "./util/common.js";
import Static from "./static.js";
import "../node_modules/@polymer/iron-icon/iron-icon.js";
import { valid, clean, satisfies, gt, lt, coerce } from "es-semver";
import Auth from "./util/auth";
/**
 * @customElement
 * @polymer
 */
class TestDeploy extends LitElement {
  render() {
    return html`
      <style>
        paper-button {
          height: 2.5em;
        }
        .paper-button-blue {
          color: rgb(240, 248, 255);
          background: rgb(30, 144, 255);
          height: 2.5em;
        }
        .paper-button-blue:hover {
          color: rgb(240, 248, 255);
          background: rgb(65, 105, 225);
        }
        paper-button[disabled] {
          background: #e1e1e1;
        }
        textarea#release-status {
          background-color: #000000;
          color: #ffffff;
        }
        .right-right {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .middle {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
        }
        .input-fields {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin: 20px;
        }
        .deploy-release-input {
          display: flex;
          flex-direction: column;
          flex-grow: 4;
          justify-content: space-between;
          margin: 20px;
        }
        .selectDeployment {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
        }
        .dropdown-right {
          display: flex;
          flex-direction: row;
        }
        span.textbox {
          /* background-color: #fff;
          color: #888; */
          /* line-height: 20px; */
          /* height: 20px; */
          /* padding: 3px; */
          /* border: 1px #888 solid; */
          /* font-size: 1pt; */
        }

        span.textbox input {
          border: 0px;
          background-color: #fff;
        }
        /* Style the tab */
        .tab {
          overflow: hidden;
          border: 1px solid #ccc;
          background-color: #f1f1f1;
        }

        /* Style the buttons that are used to open the tab content */
        .tab button {
          background-color: inherit;
          margin: auto;
          border: none;
          outline: none;
          cursor: pointer;
          padding: 14px 16px;
          transition: 0.3s;
        }

        /* Change background color of buttons on hover */
        .tab button:hover {
          background-color: #ddd;
        }

        /* Create an active/current tablink class */
        .tab button.active {
          background-color: #ccc;
        }

        /* Style the tab content */
        .tabcontent {
          display: none;
          padding: 6px 12px;
          border: 1px solid #ccc;
          border-top: none;
        }
        .app {
          display: flex; /* or inline-flex */
          justify-content: space-between;
          align-items: baseline;
          background-color: #ccf;
          padding: 6px 12px;
          border: 1px solid #ccf;
          border-top: none;
        }
        .app:hover {
          background-color: #e4e4ec;
        }
        .App {
          /* pointer-events: none; */
          display: flex; /* or inline-flex */
          justify-content: space-between;
          background-color: #ccffdd;
          padding: 6px 12px;
          border: 1px solid #ccfff0;
          border-top: none;
        }
        .delete_button:hover {
          color: #000000;
          background: #fa0b0b;
        }
        .retry_button:hover {
          color: #000000;
          background: #00ff55;
        }
        .release-list {
          height: 110px;
          overflow-y: scroll !important;
        }
      </style>
      <div id="Deployment">
        <div class="middle" style="display:flex; padding: 20px;">
          <paper-card>
            <div
              class="input-fields"
              style="flex-grow: 1;display:flex; flex-direction: column;"
            >
              <h4 style="text-align: center;text-decoration: underline;">
                Release your application
              </h4>
              <div style="display:flex; flex-direction: row; flex-grow:2;">
                <div style="display:flex; flex-direction: column; margin:20px">
                  <div>Existing Releases</div>
                  <div class="release-list">
                    <paper-listbox slot="dropdown-content">
                      ${this.applicationReleases.map(
                        (release) =>
                          html`
                            <paper-item
                              >${release.supplement.version}</paper-item
                            >
                          `
                      )}
                    </paper-listbox>
                  </div>
                </div>
                <div style="display:flex;align-items:center;">
                  <div style="display:flex; flex-direction: column;">
                    <!-- <div id="version-number-div" style="display: show"> -->
                    <div
                      id="semver-number-div"
                      style="display: flex; height: 2em; margin-bottom: 0.5em"
                    >
                      <input
                        id="input-version-number-1"
                        type="number"
                        step="1"
                        min="0"
                        value="0"
                        class="input input-version-number"
                        style="width:40px"
                      />
                      <span style="margin-top: 0.85em">.</span>
                      <input
                        id="input-version-number-2"
                        type="number"
                        step="1"
                        min="0"
                        value="0"
                        class="input input-version-number"
                        style="width:40px"
                      />
                      <span style="margin-top: 0.85em">.</span>
                      <input
                        id="input-version-number-3"
                        type="number"
                        step="1"
                        min="1"
                        value="1"
                        class="input input-version-number"
                        style="width:40px"
                      />
                    </div>
                    <!-- </div> -->
                    <paper-button
                      id="release-button"
                      @click=${this._onReleaseApplicationButtonClicked}
                      class="paper-button-blue"
                      >Release</paper-button
                    >
                  </div>
                </div>
              </div>
              <div>
                <div
                  class="form-group"
                  style="margin-left: 4px; margin-right: 4px; margin-top: 4px; height: 150px"
                >
                  <input
                    type="text"
                    class="form-control"
                    id="status"
                    style="width: 100%"
                    placeholder="Status.."
                    readonly
                  />
                  <br />
                  <textarea
                    id="release-status"
                    style="width: 100%;"
                    class="form-control"
                    readonly
                  ></textarea>
                </div>
              </div>
            </div>
          </paper-card>
          <paper-card>
            <div class="deploy-release-input">
              <h4 style="text-align: center; text-decoration: underline;">
                Deploy a release
              </h4>

              <div>
                <div style="margin-right:20px;">
                  Selected Release:
                  <paper-dropdown-menu label="Select Release">
                    <paper-listbox
                      slot="dropdown-content"
                      id="deployment-release-dropdown"
                    >
                      ${this.applicationReleases.map(
                        (release) =>
                          html`
                            <paper-item
                              >${release.supplement.version}</paper-item
                            >
                          `
                      )}
                    </paper-listbox>
                  </paper-dropdown-menu>
                </div>
                <div
                  style="display:flex; flex-direction: column; flex-grow: 4;"
                >
                  <div style="display:flex; flex-direction: column;">
                    Name
                    <span
                      class="textbox"
                      style="display:flex; flex-direction: row;"
                    >
                      <paper-input
                        type="text"
                        id="country"
                        name="country"
                        value="${this.namespacePrefixDefaultValue}-"
                        readonly
                      ></paper-input>
                      <paper-input
                        id="nameDefaultValue"
                        type="text"
                        @input="${this.nameDefaultValueInput}"
                        .value="${this.nameDefaultValue}"
                      ></paper-input>
                    </span>
                  </div>
                  <div style="display:flex; flex-direction: column;">
                    URL
                    <paper-input
                      id="urlDefaultValue"
                      type="text"
                      @input="${this.urlDefaultValueInput}"
                      .value="${this.urlDefaultValue}"
                    ></paper-input>
                  </div>
                </div>
              </div>
              <paper-button
                id="deployment-button"
                @click=${this._onDeployReleaseButtonClicked}
                class="paper-button-blue"
                ?disabled=${false}
                >Deploy your release</paper-button
              >
            </div>
          </paper-card>
        </div>
      </div>
      <paper-toast id="toast" text="Will be changed later."></paper-toast>
    `;
  }
  static get properties() {
    return {
      releaseStatus: {
        type: String,
      },
      pendingDots: {
        type: Number,
      },
      deploymentPendingDots: {
        type: Number,
      },
      portDefaultValue: {
        type: String,
      },
      namespaceDefaultValue: {
        type: String,
      },
      deployButtonStatus: {
        type: String,
      },
      namespacePrefixDefaultValue: {
        type: String,
      },
      urlDefaultValue: {
        type: String,
      },
      nameDefaultValue: {
        type: String,
      },
      applicationName: {
        type: String,
      },
      applicationId: {
        type: String,
      },
      applicationReleases: {
        type: Array,
      },
      selectedReleaseVersion: {
        type: String,
      },
      highestApplicationReleaseVersion: {
        type: String,
      },
      projectUsers: {
        type: Object,
      },
      deploymentStatus: {
        type: String,
      },
      wordList: {
        type: Array,
      },
      map: {
        type: String,
        observer: "_activeChanged",
      },
      y: {
        type: Object,
      },
      versionNumber1: {
        type: String,
      },
      versionNumber2: {
        type: String,
      },
      versionNumber3: {
        type: String,
      },
    };
  }
  showManagement() {
    this.releaseButtonStatus = "DEPLOYED";
    this.shadowRoot.getElementById("app").style.pointerEvents = "all";
  }
  showDeployment() {
    this.releaseButtonStatus = "DEPLOY";
    this.shadowRoot.getElementById("app").style.pointerEvents = "none";
  }
  showCheckNameAvailable() {
    this.releaseButtonStatus = "Check name availability";
    this.shadowRoot.getElementById("app").style.pointerEvents = "none";
  }
  nameDefaultValueInput() {
    var temp = this.shadowRoot.getElementById("nameDefaultValue");
    this.y.share.data.set("nameDefaultValue", temp.value);
  }

  portDefaultValueInput() {
    var temp = this.shadowRoot.getElementById("portDefaultValue");
    this.y.share.data.set("portDefaultValue", temp.value);
  }
  namespaceDefaultValueInput() {
    var temp = this.shadowRoot.getElementById("namespaceDefaultValue");
    this.y.share.data.set("namespaceDefaultValue", temp.value);
  }
  urlDefaultValueInput() {
    var temp = this.shadowRoot.getElementById("urlDefaultValue");
    this.y.share.data.set("urlDefaultValue", temp.value);
  }
  setReleaseStatus(data) {
    this.y.share.data.set("releaseStatus", data);
  }
  updateDefaultValue(newDefaultValue, defaultValue) {
    switch (defaultValue) {
      case "portDefaultValue":
        this.portDefaultValue = newDefaultValue;
        this.requestUpdate("newDefaultValue", newDefaultValue);
        break;
      case "nameDefaultValue":
        this.nameDefaultValue = newDefaultValue;
        this.requestUpdate("newDefaultValue", newDefaultValue);
        break;
      case "namespaceDefaultValue":
        this.namespaceDefaultValue = newDefaultValue;
        this.requestUpdate("newDefaultValue", newDefaultValue);
        break;
      case "urlDefaultValue":
        this.urlDefaultValue = newDefaultValue;
        this.requestUpdate("newDefaultValue", newDefaultValue);
        break;
      case "releaseStatus":
        this.releaseStatus = newDefaultValue;
        this.requestUpdate("releaseStatus", newDefaultValue);
        console.log(
          "releaseStatusreleaseStatusreleaseStatusreleaseStatusreleaseStatusreleaseStatus"
        );
        console.log(this.releaseStatus);
        if (this.releaseStatus != null) {
          this.pollJobConsoleText(this.releaseStatus, "Build");
        }
      default:
        break;
    }
  }

  constructor() {
    var pathname = window.location.pathname.split("/");
    super();
    self = this;
    Y({
      db: {
        name: "memory",
      },
      connector: {
        name: "websockets-client",
        room: pathname[pathname.length - 1],
        options: { resource: Static.YjsResourcePath },
        url: Static.YjsAddress,
      },
      share: {
        map: "Map",
        data: "Map",
      },
    }).then(function (y) {
      self.y = y;

      /// nameDefaultValue
      if (y.share.data.get("nameDefaultValue") == undefined) {
        y.share.data.set("nameDefaultValue", self.nameDefaultValue);
      } else {
        self.nameDefaultValue = y.share.data.get("nameDefaultValue");
      }
      /// urlDefaultValue
      if (y.share.data.get("urlDefaultValue") == undefined) {
        y.share.data.set("urlDefaultValue", self.urlDefaultValue);
      } else {
        self.urlDefaultValue = y.share.data.get("urlDefaultValue");
      }
      // deploymentStatus
      if (y.share.data.get("deploymentStatus") == undefined) {
        y.share.data.set("deploymentStatus", self.deploymentStatus);
      } else {
        self.deploymentStatus = y.share.data.get("deploymentStatus");
        y.share.data.set("deploymentStatus", "setNotDeploying");
      }
      // deploymentStatus
      if (y.share.data.get("releaseStatus") == undefined) {
        console.log("releaseStatusreleaseStatusreleaseStatus undefinnned");
        console.log(self.releaseStatus);
        y.share.data.set("releaseStatus", self.releaseStatus);
      } else {
        console.log("releaseStatusreleaseStatus definiined");
        console.log(self.releaseStatus);
        self.releaseStatus = y.share.data.get("releaseStatus");
        self.pollJobConsoleText(self.releaseStatus, "Build");
      }

      y.share.data.observe((event) => {
        if (event.name == "urlDefaultValue") {
          if (event.value != event.oldValue) {
            self.updateDefaultValue(event.value, "urlDefaultValue");
          }
        } else if (event.name == "nameDefaultValue") {
          if (event.value != event.oldValue) {
            self.updateDefaultValue(event.value, "nameDefaultValue");
          }
        } else if (event.name == "deploymentStatus") {
          // if (event.value == "setDeploying") {
          //   self.deployButtonStatus = "DEPLOY";
          //   self.deploymentStatus = "setDeploying";
          //   self.getDeployButton().disabled = true;
          //   self.shadowRoot.getElementById("nameDefaultValue").disabled = true;
          //   self.shadowRoot.getElementById("urlDefaultValue").disabled = true;
          // } else if (event.value == "setNotDeploying") {
          //   self.deploymentStatus = "setNotDeploying";
          //   self.getDeployButton().disabled = false;
          //   self.shadowRoot.getElementById("nameDefaultValue").disabled = false;
          //   self.shadowRoot.getElementById("urlDefaultValue").disabled = false;
          //   self.showDeployment();
          // } else if (event.value == "setAlreadyDeployed") {
          //   self.deploymentStatus = "setAlreadyDeployed";
          //   self.getDeployButton().disabled = true;
          //   self.shadowRoot.getElementById("nameDefaultValue").disabled = true;
          //   self.shadowRoot.getElementById("urlDefaultValue").disabled = true;
          //   self.showManagement();
          // } else if (event.value == "setCheckNameAvailable") {
          //   self.deploymentStatus = "setCheckNameAvailable";
          //   self.getDeployButton().disabled = false;
          //   self.shadowRoot.getElementById("nameDefaultValue").disabled = false;
          //   self.shadowRoot.getElementById("urlDefaultValue").disabled = false;
          //   self.showCheckNameAvailable();
          // }
        } else if (event.name == "releaseStatus") {
          if (event.value != event.oldValue) {
            self.updateDefaultValue(event.value, "releaseStatus");
          }
        }
      });
    });
    this.setupDefaultValues();
    this.requestUpdate().then((_) => {
      this.getReleaseButton().disabled = false;
      this.getStatusInput().style.setProperty("display", "none");
      this.getReleaseStatusTextarea().style.setProperty("display", "none");
      this.getOpenDeploymentLink().style.setProperty("display", "none");
      this.getReleaseStatusTextarea().style.setProperty("display", "none");
      this.getStatusInput().style.setProperty("display", "none");
    });
  }

  setupDefaultValues() {
    this.wordList = this.returnWordList();
    this.applicationReleases = [];
    this.highestApplicationReleaseVersion = "0.0.1";
    this.pendingDots = 0;
    this.nameDefaultValue =
      this.wordList[Math.floor(Math.random() * this.wordList.length)] +
      "-" +
      this.wordList[Math.floor(Math.random() * this.wordList.length)];
    this.getProjectInfo();
    this.urlDefaultValue =
      "https://mentoring.tech4comp.dbis.rwth-aachen.de/deployment/";
    this.releaseStatus = null;
    this.deploymentStatus = "setNotDeploying";
    this.versionNumber1 = "0";
    this.versionNumber2 = "0";
    this.versionNumber3 = "1";
  }
  updated() {
    this.y.share.data.set("deploymentStatus", this.deploymentStatus);
    const deploymentReleaseDropdownElement = this.shadowRoot.getElementById(
      "deployment-release-dropdown"
    );
    deploymentReleaseDropdownElement.addEventListener(
      "iron-select",
      function (e) {
        this.getDeploymentButton().disabled = false;
        this.selectedReleaseVersion = e.target.selectedItems[0].outerText;
        this.requestUpdate();
      }.bind(this)
    );
  }

  // Get all release of CAE application to show as list
  async _getReleasesOfApplication() {
    var allServices = [];
    var releaseVersions = [];
    await fetch(Static.RegistryURL + "/las2peer/services/services", {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        allServices = data;
      });
    allServices.forEach((service) => {
      Object.keys(service.releases).forEach((releaseVersion) => {
        if (
          service.releases[releaseVersion].supplement.name ==
            "cae-app-" + this.projectName &&
          service.releases[releaseVersion].supplement.id ==
            this.applicationId &&
          service.releases[releaseVersion].supplement.type == "cae-application"
        ) {
          releaseVersions.push(releaseVersion);
          this.applicationReleases.push(service.releases[releaseVersion]);
        }
      });
    });
    releaseVersions.forEach((version) => {
      if (gt(version, this.highestApplicationReleaseVersion)) {
        this.highestApplicationReleaseVersion = version;
      }
    });
    var highestVersion = this.highestApplicationReleaseVersion.split(".");
    this.setEnteredVersion(
      highestVersion[0],
      highestVersion[1],
      highestVersion[2]
    );
    this.requestUpdate();
  }

  getVersionNumberInput(part) {
    return this.shadowRoot.getElementById("input-version-number-" + part);
  }

  setEnteredVersion(major, minor, patch) {
    this.getVersionNumberInput(1).value = major;
    this.getVersionNumberInput(2).value = minor;
    this.getVersionNumberInput(3).value = patch;
  }

  getVersion() {
    return (
      this.getVersionNumberInput(1).value +
      "." +
      this.getVersionNumberInput(2).value +
      "." +
      this.getVersionNumberInput(3).value
    );
  }
  _toHumanDate(epochSeconds) {
    return new Date(epochSeconds * 1000).toLocaleString();
  }
  async checkIfNameAvailable() {
    this.setCheckNameAvailable();
    var services = [];
    await fetch(Static.RegistryURL + "/las2peer/services/services", {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        services = data;
      });
    var nameAvailable = true;
    await services.forEach((service) => {
      if (
        service.name.normalize() ==
        (
          this.namespacePrefixDefaultValue.normalize() +
          this.nameDefaultValue.normalize()
        ).normalize()
      ) {
        nameAvailable = false;
      }
    });
    return nameAvailable;
  }

  //
  // Called when deploying a new CAE deployment of an existing release
  //
  async _onDeployReleaseButtonClicked() {
    var deployNameAvailable = true;
    deployNameAvailable = await this.checkIfDeploymentNameAvailable();

    if (deployNameAvailable == true) {
      // disable button until release has finished
      this.getDeploymentButton().disabled = true;

      this._sendDeploymentRequest("DeployToCluster");
    } else {
      this.showToast("Name already taken, choose another one");
    }
  }

  // Check if name of deployment is not already taken, as in namespace unique names of deployments needed
  async checkIfDeploymentNameAvailable() {
    var deployments = [];
    await fetch(Static.RegistryURL + "/las2peer/services/deployments", {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        deployments = data;
      });
    var nameAvailable = true;
    Object.keys(deployments).forEach((release) => {
      deployments[release].forEach((deployment) => {
        if (
          deployment.clusterName.normalize() ==
          this.namespacePrefixDefaultValue.normalize() +
            "-" +
            this.nameDefaultValue.normalize()
        ) {
          nameAvailable = false;
        }
      });
    });
    return nameAvailable;
  }

  async _sendDeploymentRequest(jobAlias) {
    var id = await this._getReleaseProjectId(this.namespacePrefixDefaultValue);
    if (!id) {
      this.showToast("Error getting project id");
    } else {
      var clusterName =
        this.namespacePrefixDefaultValue + "-" + this.nameDefaultValue;
      var validName = /^([a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*)$/.test(
        clusterName
      );
      if (validName == false) {
        this.showToast("Name invalid, only use low letters and -, _ if needed");
      } else {
        fetch(
          Static.ModelPersistenceServiceURL +
            "/deploy/" +
            String(id) +
            "/" +
            jobAlias,
          {
            method: "POST",
            body: `{"name":"${this.namespacePrefixDefaultValue}","id":"${String(
              id
            )}","clusterName":"${clusterName}","version":"${
              this.selectedReleaseVersion
            }","type":"cae-application","link":"${this.urlDefaultValue}"}`,
          }
        )
          .then((response) => {
            return response.text();
          })
          .then((data) => {
            if (data.indexOf("Error") > -1) {
              console.error(data);
              this.showToast("Error calling deployment server");
              this.getDeploymentButton().disabled = false;
            } else {
              this.pollDeploymentJobConsoleText(data);
            }
          });
      }
    }
  }

  async _getReleaseProjectId(cae_application_name) {
    var projectId;
    var services = [];
    await fetch(Static.RegistryURL + "/las2peer/services/services", {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        services = data;
      });

    services.forEach((service) => {
      Object.keys(service.releases).forEach((releaseVersion) => {
        if (
          service.releases[releaseVersion].supplement.type ==
            "cae-application" &&
          service.releases[releaseVersion].supplement.name ==
            cae_application_name
        ) {
          projectId = service.releases[releaseVersion].supplement.id;
        }
      });
    });
    return projectId;
  }

  pollDeploymentJobConsoleText(location) {
    // this.getDeploymentStatusTextarea().removeAttribute("hidden");
    this.getDeploymentButton().disabled = true;
    setTimeout(
      function () {
        var feedbackString =
          "Deployment in progress " + Array(this.pendingDots + 1).join(".");
        // this.getDeploymentStatusInput().value = feedbackString;
        this.getDeploymentJobConsoleText(location);
      }.bind(this),
      1000
    );
  }
  getDeploymentJobConsoleText(queueItem) {
    fetch(
      Static.ModelPersistenceServiceURL +
        "/deployStatus?queueItem=" +
        queueItem,
      {
        method: "GET",
      }
    )
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        if (data.indexOf("Pending") > -1) {
          data =
            "Deployment " + "pending" + Array(this.pendingDots + 1).join(".");
        }

        // this.deploymentPendingDots = (this.deploymentPendingDots + 1) % 4;

        // this.getDeploymentStatusTextarea().style.removeProperty("display");
        // this.getDeploymentStatusTextarea().value = data;

        if (data.indexOf("Finished: SUCCESS") > -1) {
          this.getDeploymentButton().disabled = false;

          // this.setDeploymentStatus(null);
          // this.getDeploymentStatusInput().value =
          //   "Your CAE application has been deployed";
          this.showToast("Your CAE application has been deployed");
          // this.getDeploymentStatusTextarea().style.setProperty("display", "none");
          // allow to deploy again by activating the deploy button
          // this.getDeploymentButton().disabled = false;
        } else if (data.indexOf("Finished: FAILURE") > -1) {
          this.getDeploymentButton().disabled = false;

          this.showToast("Error during deployment");
        } else {
          this.pollDeploymentJobConsoleText(queueItem);
        }
      });
  }

  //
  // Functions called when releasing a new version of CAE application
  //
  async _onReleaseApplicationButtonClicked() {
    var releaseNameAvailable = true;
    // TODO Check if group authorized to release this application
    // releaseNameAvailable = await this.checkIfNameAvailable();

    var versionValid = true;
    versionValid = await this.checkIfVersionValid();

    if (versionValid == true) {
      // if (releaseNameAvailable == true) {
      // disable button until release has finished
      this.getReleaseButton().disabled = true;

      // show status input field and textarea for deployment status
      this.getStatusInput().style.removeProperty("display");
      // send deploy request
      this.getStatusInput().value = "Releasing CAE application ...";
      this.releaseRequest("Build");
      // } else {
      //   this.setNotReleasing();
      //   this.showToast("Name already taken, choose another one");
      // }
    } else {
      this.setNotReleasing();
    }
  }
  // Upon releasing a new CAE application release check if version is valid, so already now check if version is not already present
  async checkIfVersionValid() {
    var allServices = [];
    var releaseVersions = [];
    await fetch(Static.RegistryURL + "/las2peer/services/services", {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        allServices = data;
      });
    allServices.forEach((service) => {
      Object.keys(service.releases).forEach((releaseVersion) => {
        if (
          service.releases[releaseVersion].supplement.name ==
            "cae-app-" + this.projectName &&
          service.releases[releaseVersion].supplement.id ==
            this.applicationId &&
          service.releases[releaseVersion].supplement.type == "cae-application"
        ) {
          releaseVersions.push(releaseVersion);
        }
      });
    });
    releaseVersions.forEach((version) => {
      if (gt(version, this.highestApplicationReleaseVersion)) {
        this.highestApplicationReleaseVersion = version;
      }
    });

    var currentVersion =
      this.getVersionNumberInput(1).value +
      "." +
      this.getVersionNumberInput(2).value +
      "." +
      this.getVersionNumberInput(3).value;
    var versionNumberValid = await gt(
      currentVersion,
      this.highestApplicationReleaseVersion
    );
    if (!versionNumberValid) {
      this.showToast(
        "Version should be higher than " + this.highestApplicationReleaseVersion
      );
      return false;
    } else {
      return true;
    }
  }

  releaseRequest(jobAlias) {
    this.setDeploying();
    var pathname = window.location.pathname.split("/");
    var aut = Auth.getAuthHeader()["Authorization"].split(" ")[1];
    fetch(
      Static.ModelPersistenceServiceURL +
        "/deploy/" +
        pathname[pathname.length - 1] +
        "/" +
        jobAlias,
      {
        method: "POST",
        body: `{"name":"${this.namespacePrefixDefaultValue}","id":"${
          pathname[pathname.length - 1]
        }","deployStatus":"DEPLOYING","Authorization":"${aut}","version":"${this.getVersion()}","type":"cae-application"}`,
      }
    )
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        if (data.indexOf("Error") > -1) {
          console.error(data);
        } else {
          this.setReleaseStatus(data);
          this.getStatusInput().value = "Starting release";
          this.pollJobConsoleText(data, jobAlias);
        }
      });
  }

  pollJobConsoleText(location, jobAlias) {
    this.getReleaseStatusTextarea().removeAttribute("hidden");
    this.getReleaseButton().disabled = true;
    setTimeout(
      function () {
        var feedbackString =
          "Release in progress " + Array(this.pendingDots + 1).join(".");
        this.getStatusInput().value = feedbackString;
        this.getJobConsoleText(location, jobAlias);
      }.bind(this),
      1000
    );
  }

  getJobConsoleText(queueItem, jobAlias) {
    fetch(
      Static.ModelPersistenceServiceURL +
        "/deployStatus?queueItem=" +
        queueItem,
      {
        method: "GET",
      }
    )
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        if (data.indexOf("Pending") > -1) {
          data = "Release " + "pending" + Array(this.pendingDots + 1).join(".");
        }

        this.pendingDots = (this.pendingDots + 1) % 4;

        this.getReleaseStatusTextarea().style.removeProperty("display");
        this.getReleaseStatusTextarea().value = data;
        if (data.indexOf("Done") > -1) {
          this.setReleaseStatus(null);
          this.getReleaseButton().disabled = false;
        }
        if (data.indexOf("Finished: SUCCESS") > -1) {
          this.setReleaseStatus(null);
          this.getStatusInput().value =
            "Your CAE application has been released";
          this.getReleaseStatusTextarea().style.setProperty("display", "none");
          // allow to deploy again by activating the deploy button
          this.getReleaseButton().disabled = false;
        } else if (data.indexOf("Finished: FAILURE") > -1) {
        } else {
          this.pollJobConsoleText(queueItem, jobAlias);
        }
      });
  }

  getReleaseButton() {
    return this.shadowRoot.getElementById("release-button");
  }

  getDeploymentButton() {
    return this.shadowRoot.getElementById("deployment-button");
  }

  getReleaseStatusTextarea() {
    return this.shadowRoot.getElementById("release-status");
  }
  getDeploymentStatusTextarea() {
    return this.shadowRoot.getElementById("deploy-status");
  }

  getStatusInput() {
    return this.shadowRoot.getElementById("status");
  }

  getOpenDeploymentLink() {
    return this.shadowRoot.getElementById("open-deployment");
  }

  async getProjectInfo() {
    var pathname = window.location.pathname.split("/");
    var id = pathname[pathname.length - 1];
    this.applicationId = String(id);
    var nameofProject = "";
    var users = [];
    this.namespacePrefixDefaultValue = "cae-app-" + "projectName";
    var selectedProject;

    await fetch(Static.ProjectManagementServiceURL + '/projects', {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        data.forEach((project) => {
          project.components.forEach((component) => {
            if (component.id == id) {
              selectedProject = project;
            }
          });
        });
      });
    this.projectName = selectedProject.name;
    nameofProject = selectedProject.name;
    this.namespacePrefixDefaultValue = "cae-app-" + this.projectName;
    await this._getReleasesOfApplication();
    this.requestUpdate();
    return nameofProject;
  }
  //

  setDeploying() {
    this.y.share.data.set("deploymentStatus", "setDeploying");
  }
  setCheckNameAvailable() {
    this.y.share.data.set("deploymentStatus", "setCheckNameAvailable");
  }
  setAlreadyDeployed() {
    this.y.share.data.set("deploymentStatus", "setAlreadyDeployed");
  }
  setNotReleasing() {
    this.y.share.data.set("deploymentStatus", "setNotDeploying");
  }
  showToast(text) {
    const toastElement = this.shadowRoot.getElementById("toast");
    toastElement.text = text;
    toastElement.show();
  }

  changeRoute() {
    this.set("route.path", "/test-deploy/" + Common.getVersionedModelId());
  }
  returnWordList() {
    return [
      "chug",
      "port",
      "agal",
      "redo",
      "esth",
      "goon",
      "hopi",
      "conn",
      "vico",
      "dime",
      "hols",
      "dual",
      "juba",
      "slut",
      "safi",
      "puca",
      "yodh",
      "dyke",
      "exam",
      "prov",
      "brim",
      "boob",
      "math",
      "coed",
      "heal",
      "zeta",
      "bias",
      "napa",
      "heap",
      "stew",
      "pair",
      "chem",
      "guns",
      "ceyx",
      "glyn",
      "bard",
      "hall",
      "loun",
      "rote",
      "axle",
      "yean",
      "kung",
      "pale",
      "mage",
      "ymha",
      "purr",
      "cast",
      "ivar",
      "lion",
      "fyke",
      "ache",
      "thor",
      "quod",
      "genl",
      "sect",
      "tana",
      "prut",
      "wait",
      "send",
      "frug",
      "form",
      "bury",
      "raff",
      "cohn",
      "clea",
      "alar",
      "conk",
      "rego",
      "nysa",
      "cete",
      "gybe",
      "auto",
      "mina",
      "oryx",
      "lati",
      "hone",
      "nurl",
      "lalu",
      "lean",
      "idly",
      "nave",
      "poon",
      "alfa",
      "sour",
      "zond",
      "alep",
      "sage",
      "greg",
      "opus",
      "ibis",
      "laic",
      "pier",
      "crow",
      "cove",
      "tike",
      "nerc",
      "glob",
      "jamb",
      "atys",
      "dita",
    ];
  }
}

window.customElements.define("test-deploy", TestDeploy);
