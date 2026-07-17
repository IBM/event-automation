---
title: "Logging in"
excerpt: "Log in to your Event Endpoint Management installation."
categories: getting-started
slug: logging-in
toc: true
---

Follow the instructions to log in and log out of the {{site.data.reuse.eem_name}} UI.

**Important:** To log in to the {{site.data.reuse.eem_name}} UI, a cluster administrator must configure access and role rights by following the instructions in [managing access](../../security/managing-access/) and [managing roles](../../security/user-roles/).

## Logging in
{: #logging-in}

To log in to the {{site.data.reuse.eem_name}} UI, complete the following steps:

1. Enter the URL provided by your cluster administrator in a supported [web browser](../../installing/prerequisites/#event-manager-ui).
2. Log in to your {{site.data.reuse.eem_name}} UI. Use your credentials provided by your cluster administrator.


## Retrieving the URLs
{: #retrieving-the-urls}

As a cluster administrator, you can retrieve the URL for your {{site.data.reuse.eem_name}} UI by using the CLI. If your installation is on {{site.data.reuse.openshift_short}}, then you can also retrieve them from the {{site.data.reuse.openshift_short}} UI.

### Using the CLI
{: #using-the-cli}

To retrieve the URL for your {{site.data.reuse.eem_name}} UI, follow these steps:

1. {{site.data.reuse.cncf_cli_login}}
2. Run the following command:

   ```shell
   kubectl get eem <instance_name> -n <namespace> -o jsonpath='{'.status.endpoints'}' 
   ```

   Example output: 

   ```shell
   [{"name":"ui","type":"UI","uri":"https://qs-eem-ui.apps.my-cluster.company.com"},{"name":"gateway","type":"API","uri":"https://qs-eem-gateway.apps.my-cluster.company.com"}]%
   ```
   
   The value that is associated with the **ui** named endpoint is the URL of the {{site.data.reuse.eem_name}} UI.

3. Enter the address in a web browser. For example:

   ```shell
   https://qs-eem-ui.apps.my-cluster.company.com
   ```

4. Log in to your {{site.data.reuse.eem_name}} UI from a supported [web browser](../../installing/prerequisites/#event-manager-ui).


### Using the {{site.data.reuse.openshift_short}} UI
{: #using-openshift-ui}

If {{site.data.reuse.eem_name}} is installed on {{site.data.reuse.openshift_short}}, then to retrieve the URL for your {{site.data.reuse.eem_name}} UI, follow these steps:

1. {{site.data.reuse.openshift_ui_login}}
2. Expand **Networking** in the navigation on the left, and click **Routes**.
3. Locate the route with the name that includes your {{site.data.reuse.eem_manager}} instance name, for example, `<event-manager-instance-name>-ibm-eem-manager`. Click this route to see the UI {{site.data.reuse.eem_name}} URL. 
4. Log in to your {{site.data.reuse.eem_name}} UI from a supported [web browser](../../installing/prerequisites/#event-manager-ui).


## Logging out
{: #logging-out}

To log out of the {{site.data.reuse.eem_name}} UI, follow these steps:

1. In your UI, click the user icon ![user icon]({{ 'images' | relative_url }}/usericon.svg "The user icon."){:height="30px" width="15px"} in the upper right of the window.
2. Click **Log out**.
3. Click **Log out** again in the dialog to confirm.