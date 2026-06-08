import { config } from "@vue/test-utils";

config.global.stubs = {
  RouterLink: {
    template: "<a><slot /></a>",
    props: ["to"],
  },
  RouterView: {
    template: "<div><slot /></div>",
  },
};
