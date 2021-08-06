export default {
  name: 'App',
  data() {
    return {
      device: '',
      dns: '',
      localIpListToWan: [],
      service: '',
      tunnelStatus: '',
      version: '',
      serviceRegistered: '',
    };
  },
  mounted() {
    this.initialize();
  },
  methods: {
    registerService() {
      // register service
      this.call('POST', this.serviceRegistered);
    },
    initialize() {
      this.call('GET');
    },
    call(method, url) {
      fetch(`/cgi-bin/me/${url || ''}`, { method }).then((response) => response.json()).then((data) => {
        console.log('data', data);
        this.device = data.device;
        this.dns = data.dns;
        this.localIpListToWan = data.localIpListToWan;
        this.service = data.service;
        this.tunnelStatus = data.tunnelStatus;
        this.version = data.version;
      }).catch((error) => {
        console.log(error);
      });
    },
  },
  template: `
    <h1 class="c">OverTheBox</h1>
    <div class="box" v-if="typeof device === 'string'">
      <div v-if="service.length > 0">
        <p>
          <b>Service</b>
          <div class="mono">{{service}}</div>
        </p>
        <p>
          <b>Tunnel status</b>
          <div class="mono">{{tunnelStatus !== 0 ? 'Up' : 'Down'}}</div>
        </p>
      </div>
      <div v-if="service.length <= 0">
        <p>
          <b>This device is not associated with any service.</b>
          <br>
          Please register it on the <a href="https://www.ovhtelecom.fr/manager/#/overTheBox/">manager</a>.
          <br>
          Then confirm the service ID here.
        </p>
        <div class="c">
          <input type="text" placeholder="Enter your service ID" size="47" maxlength="47" class="c mono" id="service" v-model="serviceRegistered">
          <button class="c btn" @click="registerService">Register</button>
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
    <p>
      <b>Local IP to WAN</b>
        <ul>
          <p v-for="item in localIpListToWan">
            <b>{{item.name}}</b>
            <div class="ip">{{item.ip}}</div>
          </p>
        </ul>
    </p>
    <p>
      <b>DNS server</b>
      <div class="dns">{{dns || 'unknown dns servers'}}</div>
    </p>
    <img src="logo.png" class="logo" />
    <div class="version">{{version || 'unknown version'}}</div>
  `,
};
