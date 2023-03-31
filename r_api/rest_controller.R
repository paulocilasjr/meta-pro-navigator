#* @apiTitle IRON tool
#* Echo provided data to normalize
#* @param data table Positive and data table Negative
#* @post /metabolomics_glue 
function(req){
    timestamp = Sys.time()
    file_name = gsub(" ","", timestamp)
    
    write.csv(as.data.frame(req$postBody), "normalization_pipeline/POS.csv")

    table <- read.csv('normalization_pipeline/POS.csv')

    table


    #try(system(stringr::str_interp("cd normalization_pipeline && perl generate_metabolomics_glue_script.pl POS.csv NEG.csv ${file_name} > run_me.sh;sh run_me.sh"), intern = TRUE, ignore.stderr = TRUE))
    #try(system(stringr::str_interp("cd normalization_pipeline && rm ${file_name}_iron_log2_merged.txt && rm ${file_name}_sample_qc_table.txt")))
    #return (file_name)
}
