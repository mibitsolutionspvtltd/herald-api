const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

/**
 * Models Index - Unified Role-Based Authentication System
 * 
 * All users (including admins) are managed through the Operator table
 * with role-based access control using EntityOperatorRoleMapping and RoleType.
 * 
 * User Types (determined by role_type):
 * - Admin users: Operators with ADMIN role type
 * - Content managers: Operators with CONTENT_MANAGER role type
 * - Editors: Operators with EDITOR role type
 * - Content writers: Operators with CONTENT_WRITER role type
 * - Viewers: Operators with VIEWER role type
 */

// Import all models - Role-based authentication system
const Operator = require('./Operator');
const BackOfficeUsers = require('./BackOfficeUsers');
const EntityOperatorRoleMapping = require('./EntityOperatorRoleMapping');
const RoleType = require('./RoleType');
const RoleNesting = require('./RoleNesting');
const ActiveStatus = require('./ActiveStatus');
const Article = require('./Article');

const Category = require('./Category');
const Courses = require('./Courses');
const Document = require('./Document');
const FileUpload = require('./FileUpload');
const CarouselItems = require('./CarouselItems');
const HeroContent = require('./HeroContent');
const Universities = require('./Universities');
const Country = require('./Country');
const StateProvince = require('./StateProvince');
const City = require('./City');
const ArticleLabel = require('./ArticleLabel');
const PostStatus = require('./PostStatus');
const DocumentType = require('./DocumentType');
const DocumentCategory = require('./DocumentCategory');
const Service = require('./Service');
const CountryCodes = require('./CountryCodes');
const States = require('./States');
const Contacts = require('./Contacts');
const PinCodes = require('./PinCodes');
const SearchMetadata = require('./SearchMetadata');
const ArticleTag = require('./ArticleTag');
const ArticleViews = require('./ArticleViews');
const Tag = require('./Tag');
const DeviceRegistration = require('./DeviceRegistration');
const UserVerificationToken = require('./UserVerificationToken');
const OperatorOTPLog = require('./OperatorOTPLog');
const OperatorActivityLog = require('./OperatorActivityLog');
const ActivityType = require('./ActivityType');
const Address = require('./Address');
const AddressType = require('./AddressType');
const Gender = require('./Gender');
const PreferredLanguage = require('./PreferredLanguage');
const Advisor = require('./Advisor');
const Agent = require('./Agent');
const Consumer = require('./Consumer');
const Partner = require('./Partner');
const Invitation = require('./Invitation');
const Permission = require('./Permission');
const RolePermissions = require('./RolePermissions');
const DocumentMetadata = require('./DocumentMetadata');
const DocumentStatus = require('./DocumentStatus');
const OperatorPermission = require('./OperatorPermission');
const OperatorPasscodeLog = require('./OperatorPasscodeLog');
const DeviceDetails = require('./DeviceDetails');
const Channel = require('./Channel');
const ContentCreators = require('./ContentCreators');
const Party = require('./Party');
const PartyStatus = require('./PartyStatus');
const PartyType = require('./PartyType');
const ClientStatus = require('./ClientStatus');
const Pin = require('./Pin');
const UniversityCourses = require('./UniversityCourses');
const MerchantPlanType = require('./MerchantPlanType');
const ArticleAuthor = require('./ArticleAuthor');
const ArticleContentImage = require('./ArticleContentImage');
const ArticleRevision = require('./ArticleRevision');
const ArticleSEOAnalysis = require('./ArticleSEOAnalysis');
const RelatedArticle = require('./RelatedArticle');
const ArticleSEO = require('./ArticleSEO');
const ArticleSettings = require('./ArticleSettings');
const RobotsMetaTagType = require('./RobotsMetaTagType');
const Advertisement = require('./Advertisement');
const ConfigOptionType = require('./ConfigOptionType');
const ConfigOption = require('./ConfigOption');
const NavigationMenu = require('./NavigationMenu');
const AdvertisementType = require('./AdvertisementType');
const AdvertisementFormat = require('./AdvertisementFormat');

// Missing Master Table Models
const AccessType = require('./AccessType');
const RobotTagsType = require('./RobotTagsType');
const SchemaType = require('./SchemaType');
const IndexingStatusType = require('./IndexingStatusType');
const CommentStatusType = require('./CommentStatusType');
const EnquiryStatusType = require('./EnquiryStatusType');
const ArticleComment = require('./ArticleComment');

// Initialize all models - Role-based system
const models = {
  Operator: Operator(sequelize, DataTypes),
  BackOfficeUsers: BackOfficeUsers(sequelize, DataTypes),
  EntityOperatorRoleMapping: EntityOperatorRoleMapping(sequelize, DataTypes),
  RoleType: RoleType(sequelize, DataTypes),
  RoleNesting: RoleNesting(sequelize, DataTypes),
  ActiveStatus: ActiveStatus(sequelize, DataTypes),
  Article: Article(sequelize, DataTypes),

  Category: Category(sequelize, DataTypes),
  Courses: Courses(sequelize, DataTypes),
  Document: Document(sequelize, DataTypes),
  FileUpload: FileUpload(sequelize, DataTypes),
  CarouselItems: CarouselItems(sequelize, DataTypes),
  HeroContent: HeroContent(sequelize, DataTypes),
  Universities: Universities(sequelize, DataTypes),
  Country: Country(sequelize, DataTypes),
  StateProvince: StateProvince(sequelize, DataTypes),
  City: City(sequelize, DataTypes),
  ArticleLabel: ArticleLabel(sequelize, DataTypes),
  PostStatus: PostStatus(sequelize, DataTypes),
  DocumentType: DocumentType(sequelize, DataTypes),
  DocumentCategory: DocumentCategory(sequelize, DataTypes),
  Service: Service(sequelize, DataTypes),
  CountryCodes: CountryCodes(sequelize, DataTypes),
  States: States(sequelize, DataTypes),
  Contacts: Contacts(sequelize, DataTypes),
  PinCodes: PinCodes(sequelize, DataTypes),
  SearchMetadata: SearchMetadata(sequelize, DataTypes),
  ArticleTag: ArticleTag(sequelize, DataTypes),
  ArticleViews: ArticleViews(sequelize, DataTypes),
  Tag: Tag(sequelize, DataTypes),
  DeviceRegistration: DeviceRegistration(sequelize, DataTypes),
  UserVerificationToken: UserVerificationToken(sequelize, DataTypes),
  OperatorOTPLog: OperatorOTPLog(sequelize, DataTypes),
  OperatorActivityLog: OperatorActivityLog(sequelize, DataTypes),
  ActivityType: ActivityType(sequelize, DataTypes),
  Address: Address(sequelize, DataTypes),
  AddressType: AddressType(sequelize, DataTypes),
  Gender: Gender(sequelize, DataTypes),
  PreferredLanguage: PreferredLanguage(sequelize, DataTypes),
  Advisor: Advisor(sequelize, DataTypes),
  Agent: Agent(sequelize, DataTypes),
  Consumer: Consumer(sequelize, DataTypes),
  Partner: Partner(sequelize, DataTypes),
  Invitation: Invitation(sequelize, DataTypes),
  Permission: Permission(sequelize, DataTypes),
  RolePermissions: RolePermissions(sequelize, DataTypes),
  DocumentMetadata: DocumentMetadata(sequelize, DataTypes),
  DocumentStatus: DocumentStatus(sequelize, DataTypes),
  OperatorPermission: OperatorPermission(sequelize, DataTypes),
  OperatorPasscodeLog: OperatorPasscodeLog(sequelize, DataTypes),
  DeviceDetails: DeviceDetails(sequelize, DataTypes),
  Channel: Channel(sequelize, DataTypes),
  ContentCreators: ContentCreators(sequelize, DataTypes),
  Party: Party(sequelize, DataTypes),
  PartyStatus: PartyStatus(sequelize, DataTypes),
  PartyType: PartyType(sequelize, DataTypes),
  ClientStatus: ClientStatus(sequelize, DataTypes),
  Pin: Pin(sequelize, DataTypes),
  UniversityCourses: UniversityCourses(sequelize, DataTypes),
  MerchantPlanType: MerchantPlanType(sequelize, DataTypes),
  ArticleAuthor: ArticleAuthor(sequelize, DataTypes),
  ArticleContentImage: ArticleContentImage(sequelize, DataTypes),
  ArticleRevision: ArticleRevision(sequelize, DataTypes),
  ArticleSEOAnalysis: ArticleSEOAnalysis(sequelize, DataTypes),
  RelatedArticle: RelatedArticle(sequelize, DataTypes),
  ArticleSEO: ArticleSEO(sequelize, DataTypes),
  ArticleSettings: ArticleSettings(sequelize, DataTypes),
  RobotsMetaTagType: RobotsMetaTagType(sequelize, DataTypes),
  Advertisement: Advertisement(sequelize, DataTypes),
  ConfigOptionType: ConfigOptionType(sequelize, DataTypes),
  ConfigOption: ConfigOption(sequelize, DataTypes),
  NavigationMenu: NavigationMenu(sequelize, DataTypes),
  AdvertisementType: AdvertisementType(sequelize, DataTypes),
  AdvertisementFormat: AdvertisementFormat(sequelize, DataTypes),

  // Initialize Missing Master Table Models
  AccessType: AccessType(sequelize, DataTypes),
  RobotTagsType: RobotTagsType(sequelize, DataTypes),
  SchemaType: SchemaType(sequelize, DataTypes),
  IndexingStatusType: IndexingStatusType(sequelize, DataTypes),
  CommentStatusType: CommentStatusType(sequelize, DataTypes),
  EnquiryStatusType: EnquiryStatusType(sequelize, DataTypes),
  ArticleComment: ArticleComment(sequelize, DataTypes),
};

// Define associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};
