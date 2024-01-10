export const environment = {
  production: true,

  endpoints: {
    buildCalculator: {
      initData: "/api/builds/initData",
      saveSkill: "/api/admin/skills",
      saveBuild: "/api/profile/builds",
      updateBuild: "/api/profile/builds",
      deleteBuild: "/api/profile/builds/",
      getBuild: "/api/profile/builds/",
      getBuildWithoutAccount: "/api/builds/",
      getBuildsByLevel: "x", //HARDCODED

      getLegendaryItems: "/api/items/legendary",
      getAllDrifs: "/api/drifs",
      getAllOrbs: "/api/orbs",

      addLiker: "/api/profile/builds/add-liker",

    }

  }
};
