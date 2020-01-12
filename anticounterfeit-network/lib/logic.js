/**
	* This is just a setup demo. It will create new participants and assets automatically
	* @param {org.authentication.whey.OurSetupDemo} ourSetupDemo
	* @transaction
	*/
  function ourSetupDemo(ourSetupDemo){
    var factory  = getFactory();
    var NS = 'org.authentication.whey';
    
    // create the manufacturer 
    var manufacturer = factory.newResource(NS, 'Manufacturer', 'xyz@gmail.com');
    var manufacturerAddress = factory.newConcept(NS, 'Address' );
    manufacturerAddress.country = '180012';
    manufacturer.address = manufacturerAddress;
    manufacturer.name = 'MuscleTech';
   
    // create the distributor
    var distributor = factory.newResource(NS, 'Distributor','xyza@gmail.com');
    var distributorAddress = factory.newConcept(NS, 'Address');
    distributorAddress.country = '180012';
    distributor.address = distributorAddress;
    distributor.name = 'Kuma&KumarSports';
    


    // create the retailer

    var retailer = factory.newResource(NS, 'Retailer','xyzb@gmail.com');
    var retailerAddress = factory.newConcept(NS, 'Address');
    retailerAddress.country = '180012';
    retailer.address = retailerAddress;
    retailer.name = 'Retailer Kuma&KumarSports';
  

    // create the middleman

    var middleman = factory.newResource(NS, 'Middleman','xyzc@gmail.com');
    var middlemanPickup = factory.newConcept(NS, 'Address');
    middlemanPickup.country = '180012';
    middleman.arrivalplace = middlemanPickup;
    var middlemanDept = factory.newConcept(NS, 'Address');
    middleman.name = 'Kuma&KumarSports';
    middlemanDept.country = '180012';
    middleman.deptplace = middlemanDept;

    // create WheyProtein

    var wheyProtein = factory.newResource(NS, 'WheyProtein','2132');
    wheyProtein.owner = factory.newRelationship(NS, 'Manufacturer', 'xyz@gmail.com');
    var transfer =  ourSetupDemo.timestamp;
  wheyProtein.ManufacturerDetails = 'xyz@gmail.com';
    wheyProtein.timeoftransaction = transfer;
    wheyProtein.Type = 'ISOLATE';
    wheyProtein.Flavour = 'BANANA_CREAM';
    wheyProtein.Size = 'large'
    // A bunch of javascript promises

    return getParticipantRegistry(NS + '.Manufacturer')
        .then(function (manufacturerRegistry) {
            return manufacturerRegistry.addAll([manufacturer]);
        })
        .then(function(){
            return getParticipantRegistry(NS + '.Distributor');
        })
        .then(function (distributorRegistry){
            return distributorRegistry.addAll([distributor]);
        })
        .then(function(){
            return getParticipantRegistry(NS + '.Retailer');
        })
        .then(function (retailerRegistry){
            return retailerRegistry.addAll([retailer]);
        })
        .then(function(){
            return getParticipantRegistry(NS + '.Middleman');
        })
        .then(function (middlemanRegistry){
            return middlemanRegistry.addAll([middleman]);
        })
        .then(function(){
            return getAssetRegistry(NS + '.WheyProtein');
        })
        .then(function (wheyProteinRegistry){
            return wheyProteinRegistry.addAll([wheyProtein]);
        })
        
}
/**
* When a manufacturer transfers whey to distributor .
* Details of distributor gets appended to whey asset.
* @param {org.authentication.whey.transfertodistributor} transd - the new whey we trasnfer
* @transaction
*/
async function transfertodistributor(transd) {   // eslint-disable-line no-unused-vars
var previousowner = transd.whey.owner;
transd.whey.owner = transd.distributor;
const assetRegistry = await getAssetRegistry('org.authentication.whey.WheyProtein');
await assetRegistry.update(transd.whey);
var NS = 'org.authentication.whey';
var whey = transd.whey;

console.log('Transferring whey to '+ transd.whey.owner +' disttributor');

if(whey.DistributorDetails){
   throw new Error('INVALID ACTION')
}else{
  whey.DistributorDetails = transd;
} 

return getAssetRegistry(NS+'.WheyProtein')
.then(function(wheyProteinRegistery){
  return wheyProteinRegistery.update(whey);
});
}    
/**
* When a distributor transfers whey to retailer .
* Details of distributor gets appended to whey asset.
* @param {org.authentication.whey.transfertoretailer} transr - the new whey we trasnfer
* @transaction
*/
async function transfertoretailer(transr) {   // eslint-disable-line no-unused-vars
transr.whey.owner = transr.retailer;
const assetRegistry = await getAssetRegistry('org.authentication.whey.WheyProtein');
await assetRegistry.update(transr.whey);
}    
/**
* When a manufacturer adds a batch of whey to the blockchain.
* This creates the whey asset automatically on the blockchain.
* @param {org.authentication.whey.addwhey} wheyprotein - the new whey that we create
* @transaction
*/
async function addWhey(wheyprotein) {
var factory = getFactory();
var NS = 'org.authentication.whey';


//create whey
var wheyProtein = factory.newResource(NS, 'WheyProtein', Math.random().toString(36).substring(3));
var manufactureremail = wheyprotein.email;
wheyProtein.owner = factory.newRelationship(NS, 'Manufacturer', manufactureremail);
wheyProtein.Type = wheyprotein.type;
wheyProtein.Size = wheyprotein.size;
wheyProtein.Flavour = wheyprotein.flavour;
var time = wheyprotein.timestamp;
wheyProtein.timeoftransaction = time;
wheyProtein.ManufacturerDetails = manufactureremail;

//more js

        return getAssetRegistry(NS + '.WheyProtein')
        .then(function(wheyProtienRegistery){
          return (wheyProtienRegistery.addAll([wheyProtein]));
       });
      }
/**
* When a Retailer or Distributor sells a whey .
* Details of seller gets appended to whey asset.
* @param {org.authentication.whey.sellWhey} sell - the seller of whey
* @transaction
*/

async function sellWhey(sell) {
var NS = 'org.authentication.whey';
var whey = sell.whey;

console.log('Item sold by '+ sell.retailerId +' retailer');

if(whey.SellerDetails){
  throw new Error('INVALID ACTION');
}else{
  whey.SellerDetails = sell;
} 

return getAssetRegistry(NS+'.WheyProtein')
.then(function(wheyProteinRegistery){
  return wheyProteinRegistery.update(whey);
});

}
/**
* When a manufacturer adds a retailer of whey to the blockchain.
* This creates the retailer participant automatically on the blockchain.
* @param {org.authentication.whey.addRetailer} ret - the new retailer that we create
* @transaction
*/
async function addRetailer(ret) {
var factory = getFactory();
var NS = 'org.authentication.whey';


//create ret
var retailer = factory.newResource(NS, 'Retailer',ret.email);
var retAddress = factory.newConcept(NS, 'Address');
retAddress.country = ret.country;
retailer.address = retAddress;
retailer.name = ret.name;
retailer.email = ret.email;


//more js

return getParticipantRegistry(NS + '.Retailer')
      .then(function(retailerRegistery){
        return (retailerRegistery.addAll([retailer]));
       });
      }
/**
* When a manufacturer adds a distributor of whey to the blockchain.
* This creates the distributor participant automatically on the blockchain.
* @param {org.authentication.whey.addDistributor} dist - the new distributor that we create
* @transaction
*/
async function addDistributor(dist) {
var factory = getFactory();
var NS = 'org.authentication.whey';


//create dist
var distributor = factory.newResource(NS, 'Distributor',dist.email);
var distAddress = factory.newConcept(NS, 'Address');
distAddress.country = dist.country;
distributor.address = distAddress;
distributor.name = dist.name;
 distributor.email = dist.email;


//more js

return getParticipantRegistry(NS + '.Distributor')
      .then(function(distributorRegistery){
        return (distributorRegistery.addAll([distributor]));
       });
      }

