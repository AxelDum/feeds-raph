function displayAuthRequest() {
    return [
        m("p", m.trust("<b>This device is not associated with any service.</b><br>" +
            "Please register it on the <a href=\"https://www.ovhtelecom.fr/manager/#/overTheBox/\">manager</a>.<br>" +
            "Then confirm the service ID here.")),
        m(".c", m("input[type=text][placeholder=Enter your service ID][size=47][maxlength=47][id=service].mono")),
        m(".c", m("button", {onclick: OTB_Web_Component.register}, "Register"))
    ];
}

function listWanIntf(listIntf) {
    return listIntf.map(function(intf) {
        return m("p", [
            m("b", intf.name),
            m(".ip", intf.ip)
        ])
    })
}

var OTB_Web_Component = {
    call: function(method, url) {
        return m.request({
            method: method,
            url: "/cgi-bin/me/" + (url || ""),
        }).then(function(x) {
            OTB_Web_Component.device           = x.device
            OTB_Web_Component.service          = x.service
            OTB_Web_Component.version          = x.version
            OTB_Web_Component.dns              = x.dns
            OTB_Web_Component.localIpListToWan = x.localIpListToWan
            OTB_Web_Component.tunnelStatus     = x.tunnelStatus
        })
    },
    oninit: function() {
        return OTB_Web_Component.call("GET")
    },
    register: function() {
        return OTB_Web_Component.call("POST", document.getElementById("service").value)
    },
    view: function(vnode) {
		return [
			m("h1.c", "OverTheBox"),
			m(".box", typeof OTB_Web_Component.device == "string" ? [
				OTB_Web_Component.service.length > 0 ? [
					m("p", [
						m("b", "Service"),
						m(".mono", OTB_Web_Component.service)
					]),
					m("p", [
						m("b", "Tunnel status"),
						m(".tunnelStatus", OTB_Web_Component.tunnelStatus && OTB_Web_Component.tunnelStatus != 0 ? "Up" : "Down")
					]),
				] : [
					m(".authRequest",displayAuthRequest())
				],
				m("p", [
					m("b", "Device"),
					m(".mono", OTB_Web_Component.device)
				]),
			] : m("p.c", "Loading...")),
			m("p", [
				m("b", "Local IP to WAN"),
				m("ul", listWanIntf(OTB_Web_Component.localIpListToWan) )
			]),
			m("p", [
				m("b", "Dns servers"),
				m(".dns", OTB_Web_Component.dns || "unknown dns servers")
			]),
			m("img.logo", {src:"logo.png"}),
			m(".version", OTB_Web_Component.version || "unknown version")
		]
    },
}

m.route(document.body, "/", {
    "/": OTB_Web_Component,
})
