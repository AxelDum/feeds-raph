export default {
  name: 'App',
  data() {
    return {
      device: '',
      dns: '',
      localIpListToWan: [],
      service: '',
      tunnelStatus: '',
      isRegistering: false,
      version: '',
      serviceRegistered: '',
      retryCount: 0,
    };
  },
  mounted() {
    this.initialize();
  },
  methods: {
    registerService() {
      // register service
      this.isRegistering = true;
      this.call('POST', this.serviceRegistered, (data) => {
        if (!data.service) {
          if (this.retryCount >= 10) {
            this.retryCount = 0;
            this.isRegistering = false;

            // Add the shake animation
            document.getElementById("service").style.animation = "shake 0.82s cubic-bezier(.36,.07,.19,.97) both";
            setTimeout(() => {
              document.getElementById("service").style.animation = "";
            }, 1000)
            return
          }

          // Do the callback again in one second
          this.retryCount++;
          setTimeout(this.registerService, 1000)
          return
        }

        this.device = data.device;
        this.dns = data.dns;
        this.localIpListToWan = data.localIpListToWan;
        this.service = data.service;
        this.tunnelStatus = data.tunnelStatus;
        this.version = data.version;
      }, (error) => {console.log(error);});
    },
    refreshView() {
      this.call('GET', '', (data) => {
        if (!data.device) {
          this.device = 'Your device cannot reach the internet, is it properly connected ?'
          setTimeout(this.refreshView, 1000)
        } else {
          this.device = data.device;
        }
        this.dns = data.dns;
        this.localIpListToWan = data.localIpListToWan;
        this.service = data.service;
        this.tunnelStatus = data.tunnelStatus;
        this.version = data.version;
      }, (error) => {
        console.log(error);
      });
    },
    initialize() {
      this.refreshView();
    },
    call(method, url, callback, error) {
      fetch(`/cgi-bin/me/${url || ''}`, { method })
      .then((response) => response.json())
      .then((data) => callback(data))
      .catch((err) => error(err));
    },
  },
  template: `
    <h1 class="c">OverTheBox</h1>
    <div class="box" v-if="typeof device === 'string'">
      <div v-if="service.length > 0">
        <p class="first-paragraphe">
          <b>Service</b>
          <div class="mono">{{service}}</div>
        </p>
        <p>
          <b>Tunnel status</b>
          <div class="mono">{{tunnelStatus !== 0 ? 'Up' : 'Down'}}</div>
        </p>
      </div>
      <div v-if="service.length <= 0">
        <p class="first-paragraphe">
          <b>This device is not associated with any service.</b>
          <br>
          Please register it on the <a target="_blank" href="https://www.ovhtelecom.fr/manager/#/overTheBox/">manager</a>.
          <br>
          Then confirm the service ID here.
        </p>
        <div class="c">
          <input type="text" placeholder="overthebox.xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" size="47" maxlength="47" class="c mono" id="service" v-model="serviceRegistered">
          <button v-if="isRegistering" id="button-register" class="c btn" style="background-color: #ccccf;">
            <div style="color: transparent;" class="loading-spinner ">Register</div>
          </button>
          <button v-if="!isRegistering" id="button-register" class="c btn" @click="registerService">
            Register
          </button>
        </div>
      </div>
      <p>
        <b>Device</b>
        <div class="mono">{{device}}</div>
      </p>
    </div>
    <div class="box" v-if="!(typeof device === 'string')">
      <p class="c">The OverTheBox is registering to our servers ...</p>
    </div>
  <p style="margin-bottom: 0">
      <b>Local IP to WAN</b>
          <p v-for="item in localIpListToWan">
            <b>{{item.name}}</b>
            <div class="ip">{{item.ip}}</div>
          </p>
    </p>
    <p style="padding-top: 0; margin-top: 0;">
      <b>DNS server</b>
      <div class="dns">{{dns || 'unknown dns servers'}}</div>
    </p>
    <img src="logo.png" class="logo" />
    <div class="version">{{version ? version.replace("-", ".") : 'unknown version'}}</div>
  `,
};
