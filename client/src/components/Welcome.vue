<template>
  <div id="welcome">
   <v-app light>
    <v-content>
      <section>
        <v-parallax :src="require('@/assets/img_5591.jpg')" height="600">
          <v-layout
            column
            align-center
            justify-center
            class="white--text"
          >
            <img src="../assets/4members_logo_white.png" height="200">
            <h1 class="white--text mb-2 display-1 text-xs-center">4members - Membership Management Solution</h1>
            <div class="subheading mb-3 text-xs-center">Powered by the 4members Open Source Project</div>
            <v-btn
              color="secondary"
              class="mt-5"
              dark
              large
              @click="main"
            >
              Get Started
            </v-btn>
          </v-layout>
        </v-parallax>
      </section>

      <section>
        <v-layout
          column
          wrap
          class="my-5"
          align-center
        >
          <v-flex xs12 sm4 class="my-3">
            <div class="text-xs-center">
              <h2 class="headline">The best way to start managing your members</h2>
              <span class="subheading">
                For clubs, associations and the like
              </span>
            </div>
          </v-flex>
          <v-flex xs12>
            <v-container grid-list-xl>
              <v-layout row wrap align-top>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large color="secondary">color_lens</v-icon>
                    </v-card-text>
                    <v-card-title secondary-title class="layout justify-center">
                      <div class="headline text-xs-center">Functionality</div>
                    </v-card-title>
                    <v-card-text class="text-xs-justify">
                      Manage users by assigning roles and access codes, members and membership types
                      (normal, honorary etc.), renewal, unlimited number of
                      addresses per member (e.g. home, business, shipping etc.), officials and their roles,
                      organizational structure, dashboards and member profiles, workflows, tasks and issues.
                      <p/>
                      Full fledged financial accounting including accounts payable and receivable,
                      inventory and depreciation. Free definition of chart of accounts, products
                      and services, including invoicing. Keep track of open balances and reminders. Support
                      of standard banking interfaces to send payments and receive statements of accounts
                      including reconciliation.
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large color="secondary">flash_on</v-icon>
                    </v-card-text>
                    <v-card-title secondary-title class="layout justify-center">
                      <div class="headline">Quick Setup</div>
                    </v-card-title>
                    <v-card-text class="text-xs-justify">
                      To get you on track and up to speed fast, 4members supports various presets
                      you can select from when registering. Similar types of organizations are mapped to
                      the same preset. A preset is a set of settings including membership types, officials types,
                      organizational structure, subscriptions incl. renewals and a standard chart of account
                      tailored to fit exactly that type of organization.
                      <p/>
                      After registration you can change and extend the settings that come with the selection of a preset.
                      If your organization doesn't clearly map to one of the
                      provided presets, select the one you think comes the closest and go on from there.
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 md4>
                  <v-card class="elevation-0 transparent">
                    <v-card-text class="text-xs-center">
                      <v-icon x-large color="secondary">build</v-icon>
                    </v-card-text>
                    <v-card-title secondary-title class="layout justify-center">
                      <div class="headline text-xs-center">Extendable</div>
                    </v-card-title>
                    <v-card-text class="text-xs-justify">
                      The advantage of the 4members open source project is, that
                      it can be extended. By default 4members provides basic modules like membership
                      management and financial accounting. But the 4members modules system is built the
                      way that particular groups (clubs, associations etc.) can implement custom
                      modules that provide their particular functionality.
                      <p/>
                      If you don't find the functionality required by your organization
                      go look for people that are willing to extend the functionality of the 4members
                      solution, preferably within your organization, because these are the people that
                      know your requirements the best. If this is not possible, drop us a message, we'll
                      try to find voluntary people that are willing to help you out.
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
      </section>

      <section>
        <v-parallax :src="require('@/assets/img_5559.jpg')" height="380">
          <v-layout column align-center justify-center>
            <div class="headline white--text mb-3 text-xs-center">Membership management has never been easier</div>
            <em>Kick-start your 4members solution today</em>
            <v-btn
              color="secondary"
              class="mt-5"
              dark
              large
              @click="main"
            >
              Get Started
            </v-btn>
          </v-layout>
        </v-parallax>
      </section>

      <section>
        <v-container grid-list-xl>
          <v-layout row wrap justify-center class="my-5">
            <v-flex xs12 sm4>
              <v-card class="elevation-0 transparent">
                <v-card-title secondary-title class="layout justify-center">
                  <div class="headline">Completely Open Sourced</div>
                </v-card-title>
                <v-card-text class="text-xs-justify">
                  The 4members membership management solution is completely open sourced and provided by
                  the 4members Open Source Project.
                  <p/>
                  The 4members Open Source Project is not an organization but a group of loosely coupled developers from
                  all around the globe. Most of them are members of one or more organizations themselves and thus are
                  interested in providing a roaring software solution to their organization.
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm4 offset-sm1>
              <v-card class="elevation-0 transparent">
                <v-card-title secondary-title class="layout justify-center">
                  <div class="headline">Contact us</div>
                </v-card-title>
                <v-card-text class="text-xs-justify">
                  The best way to get in contact with us is probably by email. Drop us a message and
                  we'll come back to you.
                </v-card-text>
                <v-list class="transparent">
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon color="secondary">phone</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>+49 (0)777 867 53 09</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon color="secondary">place</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>99999 Somewherein</v-list-tile-title>
                      <v-list-tile-title>Germany</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon color="secondary">email</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>contact@4members.org</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </section>

      <v-footer color="secondary">
        <v-layout row wrap align-center>
          <v-flex xs12>
            <div class="white--text ml-3">
              Made with
              <v-icon class="red--text">favorite</v-icon>
              by the 4members Open Source Project | 4members icon made by
              <a href="https://www.flaticon.com/authors/freepik" title="Line" style="color: white">Line</a>
              from
              <a href="https://www.flaticon.com/" title="Flaticon" style="color: white">www.flaticon.com</a>
              is licensed by
              <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" style="color: white">CC 3.0 BY</a>
            </div>
          </v-flex>
        </v-layout>
      </v-footer>
    </v-content>
  </v-app>
 </div>
</template>

<script>
export default {
  name: 'Welcome',
  // data () {
  //   return {
  //     title: '4members'
  //   }
  // }
  methods: {
    async main () {
      // this.error = null
      this.$store.dispatch('setAppState', 'login')
      this.$router.push('login')
    }
  }
}
</script>
