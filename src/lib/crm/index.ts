// Contacts
export {
  getContacts,
  getContact,
  getContactsCount,
  createContact,
  updateContact,
  deleteContact,
  type ContactWithRelations,
  type CreateContactInput,
  type UpdateContactInput,
} from './contacts'

// Companies
export {
  getCompanies,
  getCompany,
  getCompaniesCount,
  createCompany,
  updateCompany,
  deleteCompany,
  type CompanyWithRelations,
  type CreateCompanyInput,
  type UpdateCompanyInput,
} from './companies'

// Deals
export {
  getDeals,
  getDeal,
  getDealsByStage,
  getDealsStats,
  createDeal,
  updateDeal,
  moveDealToStage,
  deleteDeal,
  type DealWithRelations,
  type CreateDealInput,
  type UpdateDealInput,
} from './deals'

// Pipelines
export {
  getPipelines,
  getPipeline,
  getDefaultPipeline,
  createPipeline,
  createDefaultPipeline,
  deletePipeline,
  type PipelineWithStages,
  type CreatePipelineInput,
} from './pipelines'

// Activities
export {
  getActivities,
  getRecentActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  type ActivityWithRelations,
  type CreateActivityInput,
} from './activities'

// Tags
export {
  getTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
  createDefaultTags,
} from './tags'



